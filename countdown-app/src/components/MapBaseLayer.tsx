import { useEffect, useRef, useState } from "react";
import { GeoJSON, TileLayer, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import type { Feature, FeatureCollection } from "geojson";
import { TILE_URL, TILE_ATTRIBUTION } from "../lib/mapIcon";

// デフォルメ地図（overview）と詳細タイル（detail）のモード切り替えルール:
// - overview で都道府県をクリック → その県へズームインして detail へ（メインの動線）
// - detail で「県クリック時に着地したズーム」から 1 段階ズームアウトしたら overview に戻る
// - overview のまま FORCE_DETAIL_ZOOM 以上までズームした場合も detail にする
//   （検索での移動・編集時の既存ピン表示など、クリック以外でアップになる導線のため）
const FORCE_DETAIL_ZOOM = 10;
const DEFAULT_REVERT_ZOOM = 8;

// デフォルメ地図の初期表示（日本全体）
const JAPAN_CENTER: [number, number] = [36.5, 138.0];
const JAPAN_ZOOM = 5;

// 地方ごとのパステルカラー。北（寒色）→ 南（暖色）へゆるやかなグラデーションになるように。
const REGION_COLORS: Record<string, string> = {
  hokkaido: "#dfe7fa", // ラベンダーブルー
  tohoku: "#dff0f5",   // アイスブルー
  kanto: "#ffe3ee",    // さくらピンク
  chubu: "#f3e6f7",    // ライラック
  kinki: "#ffe9d9",    // ピーチ
  chugoku: "#e4f2df",  // ミント
  shikoku: "#fdf3d3",  // クリームイエロー
  kyushu: "#ffe0dc",   // コーラル
};

// 都道府県コード（GeoJSON の properties.id, 1〜47）→ 地方
function regionOf(prefId: number): string {
  if (prefId === 1) return "hokkaido";
  if (prefId <= 7) return "tohoku";
  if (prefId <= 14) return "kanto";
  if (prefId <= 23) return "chubu";
  if (prefId <= 30) return "kinki";
  if (prefId <= 35) return "chugoku";
  if (prefId <= 39) return "shikoku";
  return "kyushu";
}

const PREF_BORDER_WEIGHT = 1.1;

function prefectureStyle(feature?: Feature) {
  const id = Number(feature?.properties?.id ?? 0);
  return {
    color: "#ffffff", // 県境は白抜きでインフォグラフィック風に
    weight: PREF_BORDER_WEIGHT,
    opacity: 1,
    fillColor: REGION_COLORS[regionOf(id)] ?? "#fff8fb",
    fillOpacity: 1,
  };
}

// 詳細タイルの上に重ねる県境オーバーレイ（塗りなし・ピンクの破線）
const PREF_OUTLINE_STYLE = {
  color: "#e78bb8",
  weight: 2,
  opacity: 0.75,
  dashArray: "6 5",
  fillOpacity: 0,
};

// 世界の国々は控えめなグレーで敷き、日本を主役にする
const WORLD_STYLE = {
  color: "#ffffff",
  weight: 0.8,
  opacity: 1,
  fillColor: "#eceff3",
  fillOpacity: 1,
};

// デフォルメ地図データ（public/ 配下、日本 33KB + 世界 77KB）のモジュールキャッシュ。
// ページ遷移で地図を開き直しても再フェッチしない。
let cachedJapan: FeatureCollection | null = null;
let cachedWorld: FeatureCollection | null = null;

export interface PrefectureSelection {
  id: number;
  name: string;
  feature: Feature;
}

// ベース地図レイヤー。デフォルメ地図では都市名や道路を出さず、パステルに
// 色分けされた県境だけにしてピン（思い出）を主役にする。都道府県をクリックすると
// その県へズームインして詳細タイル + 県境オーバーレイに切り替わる。
export default function MapBaseLayer({
  onPrefectureSelect,
  onOverview,
  flyPaddingBottom = 24,
  overviewButtonPosition = { top: "1rem", right: "1rem" },
}: {
  // 都道府県クリック時に呼ばれる（地図ビューのイベントリスト表示用）
  onPrefectureSelect?: (pref: PrefectureSelection) => void;
  // デフォルメ地図に戻ったときに呼ばれる（選択解除用）
  onOverview?: () => void;
  // 県へズームインするときの下側余白（ボトムシートと重ならないように）
  flyPaddingBottom?: number;
  // 🗾 ボタンの配置（ページごとの UI と重ならない場所を親が指定する）
  overviewButtonPosition?: React.CSSProperties;
}) {
  const map = useMap();
  // GeoJSON レイヤーの onEachFeature はレイヤー生成時の一度しか走らないため、
  // 最新のコールバックを ref 経由で参照して stale closure を避ける
  const selectRef = useRef(onPrefectureSelect);
  const overviewRef = useRef(onOverview);
  const flyPadRef = useRef(flyPaddingBottom);
  useEffect(() => {
    selectRef.current = onPrefectureSelect;
    overviewRef.current = onOverview;
    flyPadRef.current = flyPaddingBottom;
  }, [onPrefectureSelect, onOverview, flyPaddingBottom]);
  const [mode, setMode] = useState<"overview" | "detail">(() =>
    map.getZoom() >= FORCE_DETAIL_ZOOM ? "detail" : "overview",
  );
  // overview へ戻るズーム値。null の間（県へ飛行中）は戻り判定を保留する
  const revertZoomRef = useRef<number | null>(DEFAULT_REVERT_ZOOM);

  // デフォルメ地図に戻ったら親へ通知（イベントリストの選択解除など）
  useEffect(() => {
    if (mode === "overview") overviewRef.current?.();
  }, [mode]);

  useMapEvents({
    zoomend: () => {
      const z = map.getZoom();
      setMode((m) => {
        if (m === "overview" && z >= FORCE_DETAIL_ZOOM) {
          revertZoomRef.current = DEFAULT_REVERT_ZOOM;
          return "detail";
        }
        if (m === "detail" && revertZoomRef.current !== null && z <= revertZoomRef.current) {
          return "overview";
        }
        return m;
      });
    },
  });

  const [japan, setJapan] = useState<FeatureCollection | null>(cachedJapan);
  const [world, setWorld] = useState<FeatureCollection | null>(cachedWorld);

  useEffect(() => {
    if (japan && world) return;
    let alive = true;
    const load = async (file: string): Promise<FeatureCollection> => {
      const res = await fetch(`${import.meta.env.BASE_URL}${file}`);
      return res.json();
    };
    Promise.all([load("japan-prefectures.json"), load("world-countries.json")])
      .then(([jp, wd]) => {
        cachedJapan = jp;
        cachedWorld = wd;
        if (alive) {
          setJapan(jp);
          setWorld(wd);
        }
      })
      .catch(() => {
        // 取得失敗時は詳細タイルのまま表示を続ける（下のフォールバック）
      });
    return () => { alive = false; };
  }, [japan, world]);

  // クリックした都道府県へズームインして詳細表示へ。ホバーで縁を太くして反応を見せる
  const onEachPrefecture = (feature: Feature, layer: L.Layer) => {
    const path = layer as L.Polygon;
    path.on("click", (e) => {
      // LocationPicker では地図クリック＝ピン設置なので、県クリックが誤爆しないよう止める
      L.DomEvent.stopPropagation(e.originalEvent);
      revertZoomRef.current = null; // 飛行中は overview へ戻さない
      setMode("detail");
      // 県全体が収まるズームで着地する（+0.2 などで微調整可能。
      // fractional zoom を使うため MapContainer 側で zoomSnap を細かくしている）
      const bounds = path.getBounds();
      const zoom = Math.min(map.getBoundsZoom(bounds), 11);
      // ボトムシート（イベントリスト）に隠れないよう、中心を下方向へ少しずらす
      const point = map.project(bounds.getCenter(), zoom);
      point.y += flyPadRef.current / 2;
      map.flyTo(map.unproject(point, zoom), zoom, { duration: 0.9 });
      // 着地したズームから 1 段階戻したら overview に復帰（上限は DEFAULT_REVERT_ZOOM）
      map.once("moveend", () => {
        revertZoomRef.current = Math.min(map.getZoom() - 1, DEFAULT_REVERT_ZOOM);
      });
      selectRef.current?.({
        id: Number(feature.properties?.id ?? 0),
        name: String(feature.properties?.nam_ja ?? ""),
        feature,
      });
    });
    path.on("mouseover", () => path.setStyle({ weight: 2.6 }));
    path.on("mouseout", () => path.setStyle({ weight: PREF_BORDER_WEIGHT }));
  };

  const backToOverview = () => {
    revertZoomRef.current = DEFAULT_REVERT_ZOOM;
    setMode("overview");
    map.flyTo(JAPAN_CENTER, JAPAN_ZOOM, { duration: 0.9 });
  };

  // ボタンのクリック/スクロールが下の地図に抜けないようにする（ピン誤設置の防止）
  const buttonWrapRef = (el: HTMLDivElement | null) => {
    if (el) {
      L.DomEvent.disableClickPropagation(el);
      L.DomEvent.disableScrollPropagation(el);
    }
  };

  const detail = mode === "detail" || !japan || !world;

  return (
    <>
      {detail ? (
        <>
          <TileLayer attribution={TILE_ATTRIBUTION} url={TILE_URL} />
          {/* 詳細表示でも県のかたちが分かるよう、県境オーバーレイを重ねる。
              interactive: false なのでクリックは地図（ピン設置等）へ素通しされる */}
          {japan && <GeoJSON data={japan} style={PREF_OUTLINE_STYLE} interactive={false} />}
        </>
      ) : (
        <>
          <GeoJSON data={world} style={WORLD_STYLE} />
          <GeoJSON data={japan} style={prefectureStyle} onEachFeature={onEachPrefecture} />
        </>
      )}

      {/* デフォルメ地図に戻るボタン（詳細表示中のみ・地図右上にフロート） */}
      {mode === "detail" && (
        <div
          ref={buttonWrapRef}
          // ボトムシートの開閉に合わせて位置が変わるので、ふわっと追従させる
          style={{ position: "absolute", zIndex: 1000, transition: "top 0.25s ease, bottom 0.25s ease", ...overviewButtonPosition }}
        >
          {/* アイコンのみの丸ボタン（スマホでタイトルと重ならないように） */}
          <button
            type="button"
            onClick={backToOverview}
            aria-label="全体マップへ戻る"
            title="全体マップへ戻る"
            style={{
              width: "3.2rem", height: "3.2rem",
              display: "flex", alignItems: "center", justifyContent: "center",
              borderRadius: "50%",
              background: "linear-gradient(160deg, #ffffff, #fff0f7)",
              border: "1.5px solid #f6cfe2",
              boxShadow: "0 6px 18px rgba(214, 104, 158, 0.28)",
              fontSize: "1.55rem", lineHeight: 1,
              cursor: "pointer",
            }}
          >
            🗾
          </button>
        </div>
      )}
    </>
  );
}

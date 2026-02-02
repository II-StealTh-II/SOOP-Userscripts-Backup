// ==UserScript==
// @name         SOOP (숲) - 사이드바 UI 변경
// @name:ko      SOOP (숲) - 사이드바 UI 변경
// @namespace    -
// @version      20260202
// @description  사이드바 UI 변경, 월별 리캡, 채팅 모아보기, 차단기능 등
// @author       askld / eldirna / StealTh
// @match        https://www.sooplive.co.kr/*
// @match        https://play.sooplive.co.kr/*
// @match        https://vod.sooplive.co.kr/player/*
// @match        https://ch.sooplive.co.kr/*
// @icon         https://res.sooplive.co.kr/afreeca.ico
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_openInTab
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @connect      sooplive.co.kr
// @run-at       document-end
// @license      MIT
// @downloadURL  https://gist.github.com/II-StealTh-II/f85cdfe6012a56934be52509ed2e282c/raw/078acc149a4a0bd2443a94c92235f2bb8619213a/soop-sidebar-ui-change.user.js
// @updateURL    https://gist.github.com/II-StealTh-II/f85cdfe6012a56934be52509ed2e282c/raw/078acc149a4a0bd2443a94c92235f2bb8619213a/soop-sidebar-ui-change.user.js
// ==/UserScript==

(function () {
  "use strict";

  //======================================
  // 1. 전역 변수 및 설정 (Global Variables & Configuration)
  //======================================
  const NEW_UPDATE_DATE = 20250705;
  const CURRENT_URL = window.location.href;
  const IS_DARK_MODE = document.documentElement.getAttribute("dark") === "true";
  const HIDDEN_BJ_LIST = [];

  let bestStreamersList = GM_getValue("bestStreamersList", []);
  let allFollowUserIds = GM_getValue("allFollowUserIds", []);
  let STATION_FEED_DATA;

  let menuIds = {};
  let categoryMenuIds = {};
  let wordMenuIds = {};

  let displayFollow = GM_getValue("displayFollow", 6);
  let displayMyplus = GM_getValue("displayMyplus", 6);
  let displayMyplusvod = GM_getValue("displayMyplusvod", 4);
  let displayTop = GM_getValue("displayTop", 6);

  let myplusOrder = GM_getValue("myplusOrder", 1);

  let blockedUsers = GM_getValue("blockedUsers", []);
  let blockedCategories = GM_getValue("blockedCategories", []);
  let blockedWords = GM_getValue("blockedWords", []); // 방송 목록 차단 단어

  let registeredWords = GM_getValue("registeredWords", ""); // 채팅창 차단 단어
  let selectedUsers = GM_getValue("selectedUsers", ""); // 유저 채팅 모아보기 아이디
  let nicknameWidth = GM_getValue("nicknameWidth", 126);

  let isOpenNewtabEnabled = GM_getValue("isOpenNewtabEnabled", 0);
  let isOpenBackgroundTabEnabled = GM_getValue("isOpenBackgroundTabEnabled", 0);
  let isSidebarMinimized = GM_getValue("isSidebarMinimized", 0);
  let showSidebarOnScreenMode = GM_getValue("showSidebarOnScreenMode", 1);
  let showSidebarOnScreenModeAlways = GM_getValue("showSidebarOnScreenModeAlways", 0);
  let savedCategory = GM_getValue("szBroadCategory", 0);
  let isAutoChangeMuteEnabled = GM_getValue("isAutoChangeMuteEnabled", 0);
  let isAutoChangeQualityEnabled = GM_getValue("isAutoChangeQualityEnabled", 0);
  let isNo1440pEnabled = GM_getValue("isNo1440pEnabled", 0);
  let targetQuality = GM_getValue("targetQuality", "원본");
  let isDuplicateRemovalEnabled = GM_getValue("isDuplicateRemovalEnabled", 1);
  let isRemainingBufferTimeEnabled = GM_getValue("isRemainingBufferTimeEnabled", 1);
  let isPinnedStreamWithNotificationEnabled = GM_getValue("isPinnedStreamWithNotificationEnabled", 0);
  let isPinnedStreamWithPinEnabled = GM_getValue("isPinnedStreamWithPinEnabled", 0);
  let isBottomChatEnabled = GM_getValue("isBottomChatEnabled", 0);
  let isMakePauseButtonEnabled = GM_getValue("isMakePauseButtonEnabled", 1);
  let isCaptureButtonEnabled = GM_getValue("isCaptureButtonEnabled", 1);
  let isMakeSharpModeShortcutEnabled = GM_getValue("isMakeSharpModeShortcutEnabled", 1);
  let isMakeLowLatencyShortcutEnabled = GM_getValue("isMakeLowLatencyShortcutEnabled", 1);
  let isMakeQualityChangeShortcutEnabled = GM_getValue("isMakeQualityChangeShortcutEnabled", 0);
  let isSendLoadBroadEnabled = GM_getValue("isSendLoadBroadEnabled", 1);
  let isSelectBestQualityEnabled = GM_getValue("isSelectBestQualityEnabled", 1);
  let isHideSupporterBadgeEnabled = GM_getValue("isHideSupporterBadgeEnabled", 0);
  let isHideFanBadgeEnabled = GM_getValue("isHideFanBadgeEnabled", 0);
  let isHideSubBadgeEnabled = GM_getValue("isHideSubBadgeEnabled", 0);
  let isHideVIPBadgeEnabled = GM_getValue("isHideVIPBadgeEnabled", 0);
  let isHideManagerBadgeEnabled = GM_getValue("isHideManagerBadgeEnabled", 0);
  let isHideStreamerBadgeEnabled = GM_getValue("isHideStreamerBadgeEnabled", 0);
  let isBlockWordsEnabled = GM_getValue("isBlockWordsEnabled", 0);
  let isAutoClaimGemEnabled = GM_getValue("isAutoClaimGemEnabled", 0);
  let isVideoSkipHandlerEnabled = GM_getValue("isVideoSkipHandlerEnabled", 0);
  let isSmallUserLayoutEnabled = GM_getValue("isSmallUserLayoutEnabled", 0);
  let isChannelFeedEnabled = GM_getValue("isChannelFeedEnabled", 1);
  let isChangeFontEnabled = GM_getValue("isChangeFontEnabled", 0);
  let isCustomSidebarEnabled = GM_getValue("isCustomSidebarEnabled", 1);
  let isRemoveCarouselEnabled = GM_getValue("isRemoveCarouselEnabled", 0);
  let isDocumentTitleUpdateEnabled = GM_getValue("isDocumentTitleUpdateEnabled", 1);
  let isRemoveRedistributionTagEnabled = GM_getValue("isRemoveRedistributionTagEnabled", 1);
  let isRemoveWatchLaterButtonEnabled = GM_getValue("isRemoveWatchLaterButtonEnabled", 1);
  let isRemoveBroadStartTimeTagEnabled = GM_getValue("isRemoveBroadStartTimeTagEnabled", 0);
  let isBroadTitleTextEllipsisEnabled = GM_getValue("isBroadTitleTextEllipsisEnabled", 0);
  let isUnlockCopyPasteEnabled = GM_getValue("isUnlockCopyPasteEnabled", 0);
  let isAlignNicknameRightEnabled = GM_getValue("isAlignNicknameRightEnabled", 0);
  let isPreviewModalEnabled = GM_getValue("isPreviewModalEnabled", 1);
  let isPreviewModalRightClickEnabled = GM_getValue("isPreviewModalRightClickEnabled", 0);
  let isPreviewModalFromSidebarEnabled = GM_getValue("isPreviewModalFromSidebarEnabled", 0);
  let isReplaceEmptyThumbnailEnabled = GM_getValue("isReplaceEmptyThumbnailEnabled", 1);
  let isAutoScreenModeEnabled = GM_getValue("isAutoScreenModeEnabled", 0);
  let isAdjustDelayNoGridEnabled = GM_getValue("isAdjustDelayNoGridEnabled", 0);
  let ishideButtonsAboveChatInputEnabled = GM_getValue("ishideButtonsAboveChatInputEnabled", 0);
  let isExpandVODChatAreaEnabled = GM_getValue("isExpandVODChatAreaEnabled", 1);
  let isExpandLiveChatAreaEnabled = GM_getValue("isExpandLiveChatAreaEnabled", 1);
  let isRemoveShadowsFromCatchEnabled = GM_getValue("isRemoveShadowsFromCatchEnabled", 0);
  let isAdaptiveSpeedControlEnabled = GM_getValue("isAdaptiveSpeedControlEnabled", 0);
  let isShowSelectedMessagesEnabled = GM_getValue("isShowSelectedMessagesEnabled", 0);
  let isShowDeletedMessagesEnabled = GM_getValue("isShowDeletedMessagesEnabled", 0);
  let isNoAutoVODEnabled = GM_getValue("isNoAutoVODEnabled", 1);
  let isRedirectLiveEnabled = GM_getValue("isRedirectLiveEnabled", 0);
  let redirectLiveSortOption = GM_getValue("redirectLiveSortOption", "custom");
  let isHideEsportsInfoEnabled = GM_getValue("isHideEsportsInfoEnabled", 0);
  let isBlockedCategorySortingEnabled = GM_getValue("isBlockedCategorySortingEnabled", 0);
  let isChatCounterEnabled = GM_getValue("isChatCounterEnabled", 1);
  let isRandomSortEnabled = GM_getValue("isRandomSortEnabled", 0);
  let isPinnedOnlineOnlyEnabled = GM_getValue("isPinnedOnlineOnlyEnabled", 0);
  let isMonthlyRecapEnabled = GM_getValue("isMonthlyRecapEnabled", 1);
  let isClickToMuteEnabled = GM_getValue("isClickToMuteEnabled", 0);
  let isVODChatScanEnabled = GM_getValue("isVODChatScanEnabled", 0);
  let isVODHighlightEnabled = GM_getValue("isVODHighlightEnabled", 0);
  let isCheckBestStreamersListEnabled = GM_getValue("isCheckBestStreamersListEnabled", 0);
  let isClickPlayerEventMapperEnabled = GM_getValue("isClickPlayerEventMapperEnabled", 0);
  let isFavoriteGroupEnabled = GM_getValue("isFavoriteGroupEnabled", 1);
  let isCategoryGroupEnabled = GM_getValue("isCategoryGroupEnabled", 1);
  let isShortenFavoriteGroupNameEnabled = GM_getValue("isShortenFavoriteGroupNameEnabled", 0);
  let isShortenCategoryNameEnabled = GM_getValue("isShortenCategoryNameEnabled", 0);
  let isPlayerAdvancedControlsLiveEnabled = GM_getValue("isPlayerAdvancedControlsLiveEnabled", 1);
  let isPlayerAdvancedControlsVODEnabled = GM_getValue("isPlayerAdvancedControlsVODEnabled", 1);
  let isPlayerPanzoomEnabled = GM_getValue("isPlayerPanzoomEnabled", 1);
  let isPlayerPanzoomVODEnabled = GM_getValue("isPlayerPanzoomVODEnabled", 1);
  let isHideDuplicateChatEnabled = GM_getValue("isHideDuplicateChatEnabled", 0);

  let selectedFavoriteGroupIdx = isFavoriteGroupEnabled ? GM_getValue("selectedFavoriteGroupIdx", "all") : "all";
  let selectedPinnedCategoryIdx = isCategoryGroupEnabled ? GM_getValue("selectedPinnedCategoryIdx", "all") : "all";

  let sidebarSectionOrder = GM_getValue("sidebarSectionOrder", ["follow", "myplus", "myplusvod", "top"]);
  let pinnedCategories = GM_getValue("pinnedCategories", []); // 여러 카테고리 저장

  let allSections = [];

  const WEB_PLAYER_SCROLL_LEFT = isSidebarMinimized ? 52 : 240;
  const REG_WORDS = registeredWords
    ? registeredWords
        .split(",")
        .map((word) => word.trim())
        .filter(Boolean)
    : [];
  const qualityNameToInternalType = { sd: "LOW", hd: "NORMAL", hd4k: "HIGH_4000", hd8k: "HIGH_8000", original: "ORIGINAL", auto: "AUTO" };
  const BUTTON_DATA = [
    { href: "https://www.sooplive.co.kr/live/all", text: "LIVE", onClickTarget: "#live > a" },
    { href: "https://www.sooplive.co.kr/my/favorite", text: "MY", onClickTarget: "#my > a" },
    { href: "https://www.sooplive.co.kr/directory/category", text: "탐색", onClickTarget: "#cate > a" },
    { href: "https://vod.sooplive.co.kr/player/catch", text: "캐치", onClickTarget: "#catch > a" },
  ];

  let qualityChangeTimeout = null;
  let previousQualityBeforeDowngrade = null;
  let previousIsAutoMode = null;
  let didChangeToLowest = false;
  let previousViewers = 0;
  let previousTitle = "";

  const selectedUsersArray = selectedUsers
    ? selectedUsers
        .split(",")
        .map((user_id) => user_id.trim())
        .filter(Boolean)
    : [];
  const targetUserIdSet = new Set([...allFollowUserIds, ...selectedUsersArray, ...(isCheckBestStreamersListEnabled ? bestStreamersList : [])]);

  // --- 리캡 관련 전역 변수 및 상수 --- //
  let recapInitialized = false;
  let recapModalBackdrop = null; // 모달 요소 참조
  let activeCharts = []; // 활성 차트 인스턴스 저장
  let categoryImageMap = null; // 카테고리 이미지 URL 캐시
  const STATS_API_URL = "https://broadstatistic.sooplive.co.kr/api/watch_statistic.php";
  const INFO_API_URL = "https://afevent2.sooplive.co.kr/api/get_private_info.php";
  const SEARCH_API_URL = "https://sch.sooplive.co.kr/api.php";
  const CATEGORY_API_URL = "https://sch.sooplive.co.kr/api.php";
  const screenshotGradientPalette = ["linear-gradient(135deg, #667eea 0%, #764ba2 100%)", "linear-gradient(135deg, #2af598 0%, #009efd 100%)", "linear-gradient(135deg, #ffb300 0%, #f44336 100%)", "linear-gradient(135deg, #2cd48b 0%, #16a085 100%)"];
  const deviceTranslations = { desktop: "데스크톱", mobile: "모바일" };
  const typeTranslations = { general: "일반", best: "베스트", partner: "파트너" };
  const vodTypeTranslations = { review: "다시보기", highlight: "하이라이트", upload: "업로드VOD", uploadclip: "업로드클립", user: "유저VOD", userclip: "유저클립", livestarclip: "별풍선클립" };
  const chartColors = ["#e74c3c", "#8e44ad", "#3498db", "#f1c40f", "#1abc9c", "#2ecc71", "#d35400"];

  // 모아보기 버튼 위치
  const highlightButtonPosition = isShowDeletedMessagesEnabled ? "40px" : "10px";
  const statisticsButtonPosition = isVODChatScanEnabled ? "40px" : "10px";

  // 플레이어 클릭 이벤트 설정
  const USER_CLICK_CONFIG = {
    click: GM_getValue("livePlayerLeftClickFunction", "toggleMute"),
    contextmenu: GM_getValue("livePlayerRightClickFunction", "toggleScreenMode"),
    // toggleMute, togglePause, toggleStop, toggleScreenMode, toggleFullscreen
  };

  let previewModalManager = null;
  let panzoomHandlerInstance = null;
  let offlineUserModal = null;

  const IS_DEV_MODE = false;

  const customLog = {
    log: function (...args) {
      if (IS_DEV_MODE) {
        console.log(...args);
      }
    },
    warn: function (...args) {
      if (IS_DEV_MODE) {
        console.warn(...args);
      }
    },
    error: function (...args) {
      if (IS_DEV_MODE) {
        console.error(...args);
      }
    },
  };

  // 기본 사이드바 사용시 채팅 모아보기용 팔로우 채널 가져오기
  if (
    !isCustomSidebarEnabled &&
    (isShowSelectedMessagesEnabled || isShowDeletedMessagesEnabled || isVODChatScanEnabled) &&
    Date.now() - GM_getValue("lastFollowFetchTime", 0) > 900000 // 15분 쿨타임
  ) {
    getFollowList((followUserIdList) => {
      GM_setValue("lastFollowFetchTime", Date.now());
      customLog.log("user_ids:", followUserIdList);
    });
  }

  //======================================
  // 2. CSS 스타일 정의 (CSS Styles)
  //======================================
  const CommonStyles = `
    .btn_panzoom_toggle {
        width: 32px;
        height: 32px;
        padding: 0;
        background: none;
        border: none;
        cursor: pointer;
        color: white;
        opacity: 0.9;
    }
    .btn_panzoom_toggle:hover {
            opacity: 1;
    }

    /* 컨트롤 패널과 선택 영역은 기본적으로 완전히 숨김 */
    #zoom-controls-container, #roi-selector {
        display: none !important;
    }

    /* Panzoom 활성화 + 마우스 오버 시 컨트롤 패널 표시 */
    #player[data-panzoom-enabled="true"].mouseover #zoom-controls-container {
        display: block !important;
    }

    /* ROI 활성화 시 선택 영역을 DOM에 표시하되, 투명하고 클릭 불가능하게 설정 */
    #player[data-panzoom-enabled="true"][data-roi-active="true"] #roi-selector {
        display: block !important;
        opacity: 0 !important;
        pointer-events: none !important;
        transition: opacity 0.2s ease-in-out;
    }

    /* ROI 활성화 + 마우스 오버 시 선택 영역을 불투명하고 클릭 가능하게 변경 */
    #player[data-panzoom-enabled="true"][data-roi-active="true"].mouseover #roi-selector {
        opacity: 1 !important;
        pointer-events: auto !important;
    }

    /* 컨트롤 패널 버튼 */
    .player_ctrlBox .btn_advanced_controls {
        width: 32px;
        height: 32px;
        padding: 0;
        border: none;
        cursor: pointer;
        opacity: 0.9;
        background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zM15 9h2V7h4V5h-4V3h-2v6z'/%3E%3C/svg%3E") 50% 50% no-repeat;
        background-size: 22px;
    }
    .player_ctrlBox .btn_advanced_controls:hover {
        opacity: 1;
    }

    /* 고급 컨트롤 패널 */
    .advanced-controls-panel {
        position: absolute;
        bottom: 50px;
        right: 20px;
        width: 320px; /* 너비 축소 */
        background-color: rgba(24, 24, 27, 0.95);
        border: 1px solid #4f4f54;
        border-radius: 8px;
        z-index: 100;
        display: none;
        flex-direction: column;
        backdrop-filter: blur(5px);
    }

    .ac-header { /* 탭 대신 헤더 사용 */
        padding: 12px 15px;
        border-bottom: 1px solid #4f4f54;
        text-align: center;
        font-weight: bold;
        color: #efeff1;
    }

    .ac-content { padding: 20px; }

    .ac-control-group { margin-bottom: 15px; }
    .ac-control-group label { display: block; margin-bottom: 8px; font-size: 13px; color: #efeff1; }
    .ac-control-group .slider-container { display: flex; align-items: center; gap: 10px; }
    .ac-control-group input[type="range"] { flex-grow: 1; -webkit-appearance: none; appearance: none; width: 100%; height: 4px; background: #4f4f54; border-radius: 2px; cursor: pointer; }
    .ac-control-group input[type="range"]::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 16px; height: 16px; background: #5dade2; border-radius: 50%; }
    .ac-control-group input[type="range"]::-moz-range-thumb { width: 16px; height: 16px; background: #5dade2; border-radius: 50%; border: none; }
    .ac-control-group .slider-value { font-size: 12px; width: 35px; text-align: right; color: #a9a9b3; }

    .ac-footer { display: flex; justify-content: flex-end; padding: 10px 20px; border-top: 1px solid #4f4f54; }
    .ac-reset-btn { background-color: #4f4f54; color: #efeff1; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer; font-size: 13px; }
    .ac-reset-btn:hover { background-color: #636369; }

#blockWordsInput::placeholder, #selectedUsersInput::placeholder {
  font-size: 14px;
}
/* Expand 토글용 li 스타일 */
.expand-toggle-li {
    width: 32px;
    height: 32px;
    cursor: pointer;
    background-color: transparent;
    background-repeat: no-repeat;
    background-position: center;
    list-style: none;
    background-size: 20px;

    /* 채팅 확장 아이콘 */
    background-image: url('data:image/svg+xml,%3Csvg%20fill%3D%22%23757B8A%22%20height%3D%2264%22%20width%3D%2264%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20512%20512%22%20xml%3Aspace%3D%22preserve%22%20stroke%3D%22%23757B8A%22%3E%3Cg%20stroke-width%3D%220%22%2F%3E%3Cg%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3Cpath%20d%3D%22M335.085%20207.085%20469.333%2072.837V128c0%2011.782%209.551%2021.333%2021.333%2021.333S512%20139.782%20512%20128V21.335q-.001-1.055-.106-2.107c-.031-.316-.09-.622-.135-.933-.054-.377-.098-.755-.172-1.13-.071-.358-.169-.705-.258-1.056-.081-.323-.152-.648-.249-.968-.104-.345-.234-.678-.355-1.015-.115-.319-.22-.641-.35-.956s-.284-.616-.428-.923c-.153-.324-.297-.651-.467-.969-.158-.294-.337-.574-.508-.86-.186-.311-.362-.626-.565-.93-.211-.316-.447-.613-.674-.917-.19-.253-.366-.513-.568-.76a22%2022%200%200%200-1.402-1.551l-.011-.012-.011-.01a22%2022%200%200%200-1.552-1.403c-.247-.203-.507-.379-.761-.569-.303-.227-.6-.462-.916-.673-.304-.203-.619-.379-.931-.565-.286-.171-.565-.35-.859-.508-.318-.17-.644-.314-.969-.467-.307-.145-.609-.298-.923-.429-.315-.13-.637-.236-.957-.35-.337-.121-.669-.25-1.013-.354-.32-.097-.646-.168-.969-.249-.351-.089-.698-.187-1.055-.258-.375-.074-.753-.119-1.13-.173-.311-.044-.617-.104-.933-.135A22%2022%200%200%200%20490.667%200H384c-11.782%200-21.333%209.551-21.333%2021.333S372.218%2042.666%20384%2042.666h55.163L304.915%20176.915c-8.331%208.331-8.331%2021.839%200%2030.17s21.839%208.331%2030.17%200zm-158.17%2097.83L42.667%20439.163V384c0-11.782-9.551-21.333-21.333-21.333C9.551%20362.667%200%20372.218%200%20384v106.667q.001%201.055.106%202.105c.031.315.09.621.135.933.054.377.098.756.173%201.13.071.358.169.704.258%201.055.081.324.152.649.249.969.104.344.233.677.354%201.013.115.32.22.642.35.957s.284.616.429.923c.153.324.297.651.467.969.158.294.337.573.508.859.186.311.362.627.565.931.211.316.446.612.673.916.19.254.366.514.569.761q.664.811%201.403%201.552l.01.011.012.011q.741.738%201.551%201.402c.247.203.507.379.76.568.304.227.601.463.917.674.303.203.618.379.93.565.286.171.565.35.86.508.318.17.645.314.969.467.307.145.609.298.923.428s.636.235.956.35c.337.121.67.25%201.015.355.32.097.645.168.968.249.351.089.698.187%201.056.258.375.074.753.118%201.13.172.311.044.618.104.933.135q1.05.105%202.104.106H128c11.782%200%2021.333-9.551%2021.333-21.333s-9.551-21.333-21.333-21.333H72.837l134.248-134.248c8.331-8.331%208.331-21.839%200-30.17s-21.839-8.331-30.17%200zm330.821%20198.51c.226-.302.461-.598.671-.913.204-.304.38-.62.566-.932.17-.285.349-.564.506-.857.17-.318.315-.646.468-.971.145-.306.297-.607.428-.921.13-.315.236-.637.35-.957.121-.337.25-.669.354-1.013.097-.32.168-.646.249-.969.089-.351.187-.698.258-1.055.074-.375.118-.753.173-1.13.044-.311.104-.617.135-.933a22%2022%200%200%200%20.106-2.107V384c0-11.782-9.551-21.333-21.333-21.333s-21.333%209.551-21.333%2021.333v55.163L335.085%20304.915c-8.331-8.331-21.839-8.331-30.17%200s-8.331%2021.839%200%2030.17l134.248%20134.248H384c-11.782%200-21.333%209.551-21.333%2021.333S372.218%20512%20384%20512h106.667q1.055-.001%202.105-.106c.315-.031.621-.09.933-.135.377-.054.756-.098%201.13-.173.358-.071.704-.169%201.055-.258.324-.081.649-.152.969-.249.344-.104.677-.233%201.013-.354.32-.115.642-.22.957-.35s.615-.283.921-.428c.325-.153.653-.297.971-.468.293-.157.572-.336.857-.506.312-.186.628-.363.932-.566.315-.211.611-.445.913-.671.255-.191.516-.368.764-.571q.804-.659%201.54-1.392l.023-.021.021-.023q.732-.736%201.392-1.54c.205-.248.382-.509.573-.764zM72.837%2042.667H128c11.782%200%2021.333-9.551%2021.333-21.333C149.333%209.551%20139.782%200%20128%200H21.332q-1.054.001-2.104.106c-.316.031-.622.09-.933.135-.377.054-.755.098-1.13.172-.358.071-.705.169-1.056.258-.323.081-.648.152-.968.249-.345.104-.678.234-1.015.355-.319.115-.641.22-.956.35-.315.131-.618.284-.925.43-.323.152-.65.296-.967.466-.295.158-.575.338-.862.509-.31.185-.625.36-.928.563-.317.212-.615.448-.92.676-.252.189-.511.364-.756.566a21.5%2021.5%200%200%200-2.977%202.977c-.202.245-.377.504-.566.757-.228.305-.464.603-.676.92-.203.303-.378.617-.564.928-.171.286-.351.567-.509.862-.17.317-.313.643-.466.967-.145.307-.299.61-.43.925-.13.315-.235.636-.35.956-.121.337-.25.67-.355%201.015-.097.32-.168.645-.249.968-.089.351-.187.698-.258%201.056-.074.375-.118.753-.172%201.13-.044.311-.104.618-.135.933A22%2022%200%200%200%200%2021.333V128c0%2011.782%209.551%2021.333%2021.333%2021.333S42.666%20139.782%2042.666%20128V72.837l134.248%20134.248c8.331%208.331%2021.839%208.331%2030.17%200s8.331-21.839%200-30.17z%22%2F%3E%3C%2Fsvg%3E');
}
.expandVODChat .expand-toggle-li,
.expandLiveChat .expand-toggle-li {
    background-image: url('data:image/svg+xml,%3Csvg%20fill%3D%22%23757B8A%22%20height%3D%2264%22%20width%3D%2264%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20512%20512%22%20xml%3Aspace%3D%22preserve%22%20stroke%3D%22%23757B8A%22%3E%3Cg%20stroke-width%3D%220%22%2F%3E%3Cg%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3Cpath%20d%3D%22M320.106%20172.772c.031.316.09.622.135.933.054.377.098.755.172%201.13.071.358.169.705.258%201.056.081.323.152.648.249.968.104.345.234.678.355%201.015.115.319.22.641.35.956.131.315.284.618.43.925.152.323.296.65.466.967.158.294.337.574.508.86.186.311.362.626.565.93.211.316.447.613.674.917.19.253.365.513.568.759a21.4%2021.4%200%200%200%202.977%202.977c.246.202.506.378.759.567.304.228.601.463.918.675.303.203.618.379.929.565.286.171.566.351.861.509.317.17.644.314.968.466.307.145.609.298.924.429.315.13.637.236.957.35.337.121.669.25%201.013.354.32.097.646.168.969.249.351.089.698.187%201.055.258.375.074.753.119%201.13.173.311.044.617.104.932.135q1.051.105%202.105.106H448c11.782%200%2021.333-9.551%2021.333-21.333s-9.551-21.333-21.333-21.333h-55.163L505.752%2036.418c8.331-8.331%208.331-21.839%200-30.17s-21.839-8.331-30.17%200L362.667%20119.163V64c0-11.782-9.551-21.333-21.333-21.333C329.551%2042.667%20320%2052.218%20320%2064v106.668q.001%201.053.106%202.104zM170.667%2042.667c-11.782%200-21.333%209.551-21.333%2021.333v55.163L36.418%206.248c-8.331-8.331-21.839-8.331-30.17%200s-8.331%2021.839%200%2030.17l112.915%20112.915H64c-11.782%200-21.333%209.551-21.333%2021.333C42.667%20182.449%2052.218%20192%2064%20192h106.667q1.055-.001%202.105-.106c.316-.031.622-.09.933-.135.377-.054.755-.098%201.13-.172.358-.071.705-.169%201.056-.258.323-.081.648-.152.968-.249.345-.104.678-.234%201.015-.355.319-.115.641-.22.956-.35.315-.131.618-.284.925-.43.323-.152.65-.296.967-.466.295-.158.575-.338.862-.509.311-.185.625-.361.928-.564.317-.212.615-.448.92-.676.252-.189.511-.364.757-.566a21.5%2021.5%200%200%200%202.977-2.977c.202-.246.377-.505.566-.757.228-.305.464-.603.676-.92.203-.303.378-.617.564-.928.171-.286.351-.567.509-.862.17-.317.313-.643.466-.967.145-.307.299-.61.43-.925.13-.315.235-.636.35-.956.121-.337.25-.67.355-1.015.097-.32.168-.645.249-.968.089-.351.187-.698.258-1.056.074-.375.118-.753.172-1.13.044-.311.104-.618.135-.933q.105-1.05.106-2.104V64c-.002-11.782-9.553-21.333-21.335-21.333zm21.227%20296.561c-.031-.316-.09-.622-.135-.933-.054-.377-.098-.755-.172-1.13-.071-.358-.169-.705-.258-1.056-.081-.323-.152-.648-.249-.968-.104-.345-.234-.678-.355-1.015-.115-.319-.22-.641-.35-.956-.131-.315-.284-.618-.43-.925-.152-.323-.296-.65-.466-.967-.158-.295-.338-.575-.509-.862-.185-.311-.361-.625-.564-.928-.212-.317-.448-.615-.676-.92-.189-.252-.364-.511-.566-.757a21.5%2021.5%200%200%200-2.977-2.977c-.246-.202-.505-.377-.757-.566-.305-.228-.603-.464-.92-.676-.303-.203-.617-.378-.928-.564-.286-.171-.567-.351-.862-.509-.317-.17-.643-.313-.967-.466-.307-.145-.61-.299-.925-.43-.315-.13-.636-.235-.956-.35-.337-.121-.67-.25-1.015-.355-.32-.097-.645-.168-.968-.249-.351-.089-.698-.187-1.056-.258-.375-.074-.753-.118-1.13-.172-.311-.044-.618-.104-.933-.135q-1.051-.105-2.105-.106H64c-11.782%200-21.333%209.551-21.333%2021.333S52.218%20362.664%2064%20362.664h55.163L6.248%20475.582c-8.331%208.331-8.331%2021.839%200%2030.17s21.839%208.331%2030.17%200l112.915-112.915V448c0%2011.782%209.551%2021.333%2021.333%2021.333s21.333-9.551%2021.333-21.333V341.332a21%2021%200%200%200-.105-2.104zm200.943%2023.439H448c11.782%200%2021.333-9.551%2021.333-21.333s-9.551-21.333-21.333-21.333H341.333q-1.055.001-2.105.106c-.315.031-.621.09-.932.135-.378.054-.756.098-1.13.173-.358.071-.704.169-1.055.258-.324.081-.649.152-.969.249-.344.104-.677.233-1.013.354-.32.115-.642.22-.957.35-.315.131-.617.284-.924.429-.324.153-.65.296-.968.466-.295.158-.575.338-.861.509-.311.186-.626.362-.929.565-.316.212-.614.447-.918.675-.253.19-.512.365-.759.567a21.4%2021.4%200%200%200-2.977%202.977c-.202.246-.378.506-.568.759-.227.304-.463.601-.674.917-.203.304-.379.619-.565.93-.171.286-.351.566-.508.86-.17.317-.313.643-.466.967-.145.307-.299.61-.43.925-.13.315-.235.636-.35.956-.121.337-.25.67-.355%201.015-.097.32-.168.645-.249.968-.089.351-.187.698-.258%201.056-.074.374-.118.753-.172%201.13-.044.311-.104.618-.135.933q-.105%201.05-.106%202.104V448c0%2011.782%209.551%2021.333%2021.333%2021.333s21.333-9.551%2021.333-21.333v-55.163l112.915%20112.915c8.331%208.331%2021.839%208.331%2030.17%200s8.331-21.839%200-30.17z%22%2F%3E%3C%2Fsvg%3E');
}

html[dark="true"] .expand-toggle-li {
    background-image: url('data:image/svg+xml,%3Csvg%20fill%3D%22%23ACB0B9%22%20height%3D%2264%22%20width%3D%2264%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20512%20512%22%20xml%3Aspace%3D%22preserve%22%3E%3Cg%20stroke-width%3D%220%22%2F%3E%3Cg%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3Cpath%20d%3D%22M335.085%20207.085%20469.333%2072.837V128c0%2011.782%209.551%2021.333%2021.333%2021.333S512%20139.782%20512%20128V21.335q-.001-1.055-.106-2.107c-.031-.316-.09-.622-.135-.933-.054-.377-.098-.755-.172-1.13-.071-.358-.169-.705-.258-1.056-.081-.323-.152-.648-.249-.968-.104-.345-.234-.678-.355-1.015-.115-.319-.22-.641-.35-.956s-.284-.616-.428-.923c-.153-.324-.297-.651-.467-.969-.158-.294-.337-.574-.508-.86-.186-.311-.362-.626-.565-.93-.211-.316-.447-.613-.674-.917-.19-.253-.366-.513-.568-.76a22%2022%200%200%200-1.402-1.551l-.011-.012-.011-.01a22%2022%200%200%200-1.552-1.403c-.247-.203-.507-.379-.761-.569-.303-.227-.6-.462-.916-.673-.304-.203-.619-.379-.931-.565-.286-.171-.565-.35-.859-.508-.318-.17-.644-.314-.969-.467-.307-.145-.609-.298-.923-.429-.315-.13-.637-.236-.957-.35-.337-.121-.669-.25-1.013-.354-.32-.097-.646-.168-.969-.249-.351-.089-.698-.187-1.055-.258-.375-.074-.753-.119-1.13-.173-.311-.044-.617-.104-.933-.135A22%2022%200%200%200%20490.667%200H384c-11.782%200-21.333%209.551-21.333%2021.333S372.218%2042.666%20384%2042.666h55.163L304.915%20176.915c-8.331%208.331-8.331%2021.839%200%2030.17s21.839%208.331%2030.17%200m-158.17%2097.83L42.667%20439.163V384c0-11.782-9.551-21.333-21.333-21.333C9.551%20362.667%200%20372.218%200%20384v106.667q.001%201.055.106%202.105c.031.315.09.621.135.933.054.377.098.756.173%201.13.071.358.169.704.258%201.055.081.324.152.649.249.969.104.344.233.677.354%201.013.115.32.22.642.35.957s.284.616.429.923c.153.324.297.651.467.969.158.294.337.573.508.859.186.311.362.627.565.931.211.316.446.612.673.916.19.254.366.514.569.761q.664.811%201.403%201.552l.01.011.012.011q.741.738%201.551%201.402c.247.203.507.379.76.568.304.227.601.463.917.674.303.203.618.379.93.565.286.171.565.35.86.508.318.17.645.314.969.467.307.145.609.298.923.428s.636.235.956.35c.337.121.67.25%201.015.355.32.097.645.168.968.249.351.089.698.187%201.056.258.375.074.753.118%201.13.172.311.044.618.104.933.135q1.05.105%202.104.106H128c11.782%200%2021.333-9.551%2021.333-21.333s-9.551-21.333-21.333-21.333H72.837l134.248-134.248c8.331-8.331%208.331-21.839%200-30.17s-21.839-8.331-30.17%200m330.821%20198.51c.226-.302.461-.598.671-.913.204-.304.38-.62.566-.932.17-.285.349-.564.506-.857.17-.318.315-.646.468-.971.145-.306.297-.607.428-.921.13-.315.236-.637.35-.957.121-.337.25-.669.354-1.013.097-.32.168-.646.249-.969.089-.351.187-.698.258-1.055.074-.375.118-.753.173-1.13.044-.311.104-.617.135-.933a22%2022%200%200%200%20.106-2.107V384c0-11.782-9.551-21.333-21.333-21.333s-21.333%209.551-21.333%2021.333v55.163L335.085%20304.915c-8.331-8.331-21.839-8.331-30.17%200s-8.331%2021.839%200%2030.17l134.248%20134.248H384c-11.782%200-21.333%209.551-21.333%2021.333S372.218%20512%20384%20512h106.667q1.055-.001%202.105-.106c.315-.031.621-.09.933-.135.377-.054.756-.098%201.13-.173.358-.071.704-.169%201.055-.258.324-.081.649-.152.969-.249.344-.104.677-.233%201.013-.354.32-.115.642-.22.957-.35s.615-.283.921-.428c.325-.153.653-.297.971-.468.293-.157.572-.336.857-.506.312-.186.628-.363.932-.566.315-.211.611-.445.913-.671.255-.191.516-.368.764-.571q.804-.659%201.54-1.392l.023-.021.021-.023q.732-.736%201.392-1.54c.205-.248.382-.509.573-.764M72.837%2042.667H128c11.782%200%2021.333-9.551%2021.333-21.333C149.333%209.551%20139.782%200%20128%200H21.332q-1.054.001-2.104.106c-.316.031-.622.09-.933.135-.377.054-.755.098-1.13.172-.358.071-.705.169-1.056.258-.323.081-.648.152-.968.249-.345.104-.678.234-1.015.355-.319.115-.641.22-.956.35-.315.131-.618.284-.925.43-.323.152-.65.296-.967.466-.295.158-.575.338-.862.509-.31.185-.625.36-.928.563-.317.212-.615.448-.92.676-.252.189-.511.364-.756.566a21.5%2021.5%200%200%200-2.977%202.977c-.202.245-.377.504-.566.757-.228.305-.464.603-.676.92-.203.303-.378.617-.564.928-.171.286-.351.567-.509.862-.17.317-.313.643-.466.967-.145.307-.299.61-.43.925-.13.315-.235.636-.35.956-.121.337-.25.67-.355%201.015-.097.32-.168.645-.249.968-.089.351-.187.698-.258%201.056-.074.375-.118.753-.172%201.13-.044.311-.104.618-.135.933A22%2022%200%200%200%200%2021.333V128c0%2011.782%209.551%2021.333%2021.333%2021.333S42.666%20139.782%2042.666%20128V72.837l134.248%20134.248c8.331%208.331%2021.839%208.331%2030.17%200s8.331-21.839%200-30.17z%22%2F%3E%3C%2Fsvg%3E') !important;
}
html[dark="true"] .expandVODChat .expand-toggle-li,
html[dark="true"] .expandLiveChat .expand-toggle-li {
    background-image: url('data:image/svg+xml,%3Csvg%20fill%3D%22%23ACB0B9%22%20height%3D%2264%22%20width%3D%2264%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20512%20512%22%20xml%3Aspace%3D%22preserve%22%20stroke%3D%22%23ACB0B9%22%3E%3Cg%20stroke-width%3D%220%22%2F%3E%3Cg%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke%3D%22%23CCC%22%20stroke-width%3D%222.048%22%2F%3E%3Cpath%20d%3D%22M320.106%20172.772c.031.316.09.622.135.933.054.377.098.755.172%201.13.071.358.169.705.258%201.056.081.323.152.648.249.968.104.345.234.678.355%201.015.115.319.22.641.35.956.131.315.284.618.43.925.152.323.296.65.466.967.158.294.337.574.508.86.186.311.362.626.565.93.211.316.447.613.674.917.19.253.365.513.568.759a21.4%2021.4%200%200%200%202.977%202.977c.246.202.506.378.759.567.304.228.601.463.918.675.303.203.618.379.929.565.286.171.566.351.861.509.317.17.644.314.968.466.307.145.609.298.924.429.315.13.637.236.957.35.337.121.669.25%201.013.354.32.097.646.168.969.249.351.089.698.187%201.055.258.375.074.753.119%201.13.173.311.044.617.104.932.135q1.051.105%202.105.106H448c11.782%200%2021.333-9.551%2021.333-21.333s-9.551-21.333-21.333-21.333h-55.163L505.752%2036.418c8.331-8.331%208.331-21.839%200-30.17s-21.839-8.331-30.17%200L362.667%20119.163V64c0-11.782-9.551-21.333-21.333-21.333C329.551%2042.667%20320%2052.218%20320%2064v106.668q.001%201.053.106%202.104zM170.667%2042.667c-11.782%200-21.333%209.551-21.333%2021.333v55.163L36.418%206.248c-8.331-8.331-21.839-8.331-30.17%200s-8.331%2021.839%200%2030.17l112.915%20112.915H64c-11.782%200-21.333%209.551-21.333%2021.333C42.667%20182.449%2052.218%20192%2064%20192h106.667q1.055-.001%202.105-.106c.316-.031.622-.09.933-.135.377-.054.755-.098%201.13-.172.358-.071.705-.169%201.056-.258.323-.081.648-.152.968-.249.345-.104.678-.234%201.015-.355.319-.115.641-.22.956-.35.315-.131.618-.284.925-.43.323-.152.65-.296.967-.466.295-.158.575-.338.862-.509.311-.185.625-.361.928-.564.317-.212.615-.448.92-.676.252-.189.511-.364.757-.566a21.5%2021.5%200%200%200%202.977-2.977c.202-.246.377-.505.566-.757.228-.305.464-.603.676-.92.203-.303.378-.617.564-.928.171-.286.351-.567.509-.862.17-.317.313-.643.466-.967.145-.307.299-.61.43-.925.13-.315.235-.636.35-.956.121-.337.25-.67.355-1.015.097-.32.168-.645.249-.968.089-.351.187-.698.258-1.056.074-.375.118-.753.172-1.13.044-.311.104-.618.135-.933q.105-1.05.106-2.104V64c-.002-11.782-9.553-21.333-21.335-21.333zm21.227%20296.561c-.031-.316-.09-.622-.135-.933-.054-.377-.098-.755-.172-1.13-.071-.358-.169-.705-.258-1.056-.081-.323-.152-.648-.249-.968-.104-.345-.234-.678-.355-1.015-.115-.319-.22-.641-.35-.956-.131-.315-.284-.618-.43-.925-.152-.323-.296-.65-.466-.967-.158-.295-.338-.575-.509-.862-.185-.311-.361-.625-.564-.928-.212-.317-.448-.615-.676-.92-.189-.252-.364-.511-.566-.757a21.5%2021.5%200%200%200-2.977-2.977c-.246-.202-.505-.377-.757-.566-.305-.228-.603-.464-.92-.676-.303-.203-.617-.378-.928-.564-.286-.171-.567-.351-.862-.509-.317-.17-.643-.313-.967-.466-.307-.145-.61-.299-.925-.43-.315-.13-.636-.235-.956-.35-.337-.121-.67-.25-1.015-.355-.32-.097-.645-.168-.968-.249-.351-.089-.698-.187-1.056-.258-.375-.074-.753-.118-1.13-.172-.311-.044-.618-.104-.933-.135q-1.051-.105-2.105-.106H64c-11.782%200-21.333%209.551-21.333%2021.333S52.218%20362.664%2064%20362.664h55.163L6.248%20475.582c-8.331%208.331-8.331%2021.839%200%2030.17s21.839%208.331%2030.17%200l112.915-112.915V448c0%2011.782%209.551%2021.333%2021.333%2021.333s21.333-9.551%2021.333-21.333V341.332a21%2021%200%200%200-.105-2.104zm200.943%2023.439H448c11.782%200%2021.333-9.551%2021.333-21.333s-9.551-21.333-21.333-21.333H341.333q-1.055.001-2.105.106c-.315.031-.621.09-.932.135-.378.054-.756.098-1.13.173-.358.071-.704.169-1.055.258-.324.081-.649.152-.969.249-.344.104-.677.233-1.013.354-.32.115-.642.22-.957.35-.315.131-.617.284-.924.429-.324.153-.65.296-.968.466-.295.158-.575.338-.861.509-.311.186-.626.362-.929.565-.316.212-.614.447-.918.675-.253.19-.512.365-.759.567a21.4%2021.4%200%200%200-2.977%202.977c-.202.246-.378.506-.568.759-.227.304-.463.601-.674.917-.203.304-.379.619-.565.93-.171.286-.351.566-.508.86-.17.317-.313.643-.466.967-.145.307-.299.61-.43.925-.13.315-.235.636-.35.956-.121.337-.25.67-.355%201.015-.097.32-.168.645-.249.968-.089.351-.187.698-.258%201.056-.074.374-.118.753-.172%201.13-.044.311-.104.618-.135.933q-.105%201.05-.106%202.104V448c0%2011.782%209.551%2021.333%2021.333%2021.333s21.333-9.551%2021.333-21.333v-55.163l112.915%20112.915c8.331%208.331%2021.839%208.331%2030.17%200s8.331-21.839%200-30.17z%22%2F%3E%3C%2Fsvg%3E') !important;
}

.screen_mode .expand-toggle-li,
.fullScreen_mode .expand-toggle-li {
    display: none !important;
}

.customSidebar #serviceLnb {
    display: none !important;
}

.left_navbar {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    position: fixed;
    flex-direction: row-reverse;
    top: 0px;
    left: 128px;
    z-index: 9999;
    background-color: white;
}
html[dark="true"] .left_navbar {
    background-color: #0c0d0e;
}

html[dark="true"] .left_nav_button {
    color: #e5e5e5;
}
html:not([dark="true"]) .left_nav_button {
    color: #1F1F23;
}
html[dark="true"] .left_nav_button {
    color: #e5e5e5;
}
html:not([dark="true"]) .left_nav_button {
    color: #1F1F23;
}

.left_navbar button.left_nav_button {
    position: relative;
    width: 68px;
    height: 64px;
    padding: 0;
    border: 0;
    cursor: pointer;
    z-index: 3001;
    font-size: 1.25em !important;
    font-weight: 600;
}

@media (max-width: 1280px) {
    #serviceHeader .left_navbar {
        left: 124px !important;
    }
    #serviceHeader .left_nav_button {
        width: 58px !important;
        font-size: 1.2em !important;
    }
}

@media (max-width: 1100px) {
    #serviceHeader .left_navbar {
        left: 120px !important;
    }
    #serviceHeader .left_nav_button {
        width: 46px !important;
        font-size: 1.1em !important;
    }
}

#sidebar {
    top: 64px;
    display: flex !important;
    flex-direction: column !important;
}

.starting-line .chatting-list-item .message-container .username {
    width: ${nicknameWidth}px !important;
}

.duration-overlay {
    position: absolute;
    top: 235px;
    right: 4px;
    background-color: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 2px 5px;
    font-size: 15px;
    border-radius: 3px;
    z-index:9999;
    line-height: 17px;
}

#studioPlayKorPlayer,
#studioPlayKor,
#studioPlay,
.btn-broadcast {
    display: none;
}

/* =================================================================
    [수정됨] 다크모드/라이트모드 자동 감지 변수 시스템
    기본값: 라이트 모드 / html[dark="true"]일 때: 다크 모드
================================================================= */
#myModal {
    /* ☀️ [기본값] 라이트 모드 색상 정의 */
    --bg-color-v8xK4z: #f8f9fa;       /* 메뉴바 배경 */
    --surface-color-v8xK4z: #ffffff;  /* 콘텐츠 배경 */
    --primary-text-v8xK4z: #1f1f23;   /* 기본 글자 */
    --secondary-text-v8xK4z: #53535f; /* 보조 글자 */
    --accent-color-v8xK4z: #4279ff;   /* 강조 색상 */
    --border-color-v8xK4z: #d1d1d1;   /* 테두리 */
    --input-bg-v8xK4z: #eff0f3;       /* 입력창 배경 */
    --hover-bg-v8xK4z: rgba(0, 0, 0, 0.05); /* 호버 효과 */
    --scrollbar-thumb-v8xK4z: #cccccc; /* 스크롤바 색상 */
    --font-family-v8xK4z: sans-serif;

    display: none;
    position: fixed;
    z-index: 9999;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background-color: rgba(0, 0, 0, 0.5); /* 배경은 항상 반투명 검정 */
    font-family: var(--font-family-v8xK4z);
    color: var(--primary-text-v8xK4z);
}

/* 🌙 [오버라이드] 다크 모드 색상 (dark="true"일 때만 덮어쓰기) */
html[dark="true"] #myModal {
    --bg-color-v8xK4z: #1a1a1a;
    --surface-color-v8xK4z: #2c2c2c;
    --primary-text-v8xK4z: #ffffff;
    --secondary-text-v8xK4z: #a0a0a0;
    --accent-color-v8xK4z: #0078d4;
    --border-color-v8xK4z: #444444;
    --input-bg-v8xK4z: #333333;
    --hover-bg-v8xK4z: rgba(255, 255, 255, 0.1);
    --scrollbar-thumb-v8xK4z: #555;
}

#myModal .modal-content_v8xK4z {
    background-color: var(--surface-color-v8xK4z);
    margin: 5vh auto;
    border: 1px solid var(--border-color-v8xK4z);
    border-radius: 12px;
    width: clamp(700px, 90%, 900px);
    height: 90vh;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    display: flex;
    flex-direction: row;
    overflow: hidden;
}

/* 인덱스 메뉴 스타일 */
#myModal .modal-index_v8xK4z {
    flex-shrink: 0;
    width: 180px;
    padding: 20px 10px;
    border-right: 1px solid var(--border-color-v8xK4z);
    background-color: var(--bg-color-v8xK4z);
    overflow-y: auto;
}

#myModal .index-title_v8xK4z {
    font-size: 16px;
    font-weight: 700;
    padding: 0 10px 10px;
    margin: 0 0 10px;
    border-bottom: 1px solid var(--border-color-v8xK4z);
    color: var(--primary-text-v8xK4z);
}

#myModal .index-button_v8xK4z {
    display: block;
    width: 100%;
    padding: 10px 15px;
    margin-bottom: 5px;
    background: none;
    border: none;
    border-radius: 6px;
    color: var(--secondary-text-v8xK4z);
    text-align: left;
    font-size: 14px;
    cursor: pointer;
    transition: background-color 0.2s, color 0.2s;
}

#myModal .index-button_v8xK4z:hover {
    background-color: var(--hover-bg-v8xK4z); /* 변수 적용 */
    color: var(--primary-text-v8xK4z);
}

#myModal .index-button_v8xK4z.active {
    background-color: var(--accent-color-v8xK4z);
    color: white;
    font-weight: bold;
}

/* 메인 콘텐츠 영역 스타일 */
#myModal .modal-main-content_v8xK4z {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

#myModal .modal-header_v8xK4z {
    padding: 16px 24px;
    border-bottom: 1px solid var(--border-color-v8xK4z);
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-shrink: 0;
}

#myModal .modal-title_v8xK4z {
    font-size: 22px;
    font-weight: 700;
    margin: 0;
}

#myModal .close-button_v8xK4z {
    background: none;
    border: none;
    color: var(--secondary-text-v8xK4z);
    font-size: 32px;
    font-weight: bold;
    cursor: pointer;
    transition: color 0.2s;
}

#myModal .close-button_v8xK4z:hover,
#myModal .close-button_v8xK4z:focus {
    color: var(--primary-text-v8xK4z);
}

#myModal .modal-body_v8xK4z {
    padding: 24px;
    overflow-y: auto;
    flex-grow: 1;
    padding-bottom: 60vh;
}

#myModal .modal-footer_v8xK4z {
    padding-top: 24px;
    margin-top: 24px;
    border-top: 1px solid var(--border-color-v8xK4z);
}

#myModal .section-title_v8xK4z {
    font-size: 18px;
    font-weight: 500;
    color: var(--primary-text-v8xK4z);
    margin-top: 0;
    margin-bottom: 20px;
    border-left: 3px solid var(--accent-color-v8xK4z);
    padding-left: 10px;
    scroll-margin-top: 24px;
}

#myModal .option_v8xK4z {
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: center;
    padding: 8px;
    border-radius: 8px;
    transition: background-color 0.2s;
}

#myModal .option_v8xK4z label {
    font-size: 15px;
    color: var(--secondary-text-v8xK4z);
}
#myModal .option_v8xK4z:not(.multi-option_v8xK4z):hover {
    background-color: var(--hover-bg-v8xK4z); /* 변수 적용 */
}

#myModal .range-option_v8xK4z {
    grid-template-columns: auto 1fr;
    gap: 20px;
}

#myModal .range-container_v8xK4z {
    display: flex;
    align-items: center;
    gap: 15px;
}

#myModal input[type="range"] {
    width: 100%;
}

#myModal .range-value_v8xK4z {
    font-size: 15px;
    color: var(--primary-text-v8xK4z);
    min-width: 30px;
    text-align: right;
}

#myModal .switch_v8xK4z {
    position: relative;
    display: inline-block;
    width: 50px;
    height: 28px;
}

#myModal .switch_v8xK4z input {
    opacity: 0;
    width: 0;
    height: 0;
}

#myModal .slider_v8xK4z {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #4d4d4d;
    transition: .4s;
    border-radius: 28px;
}

#myModal .slider_v8xK4z:before {
    position: absolute;
    content: "";
    height: 20px;
    width: 20px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    transition: .4s;
    border-radius: 50%;
}

#myModal input:checked + .slider_v8xK4z {
    background-color: var(--accent-color-v8xK4z);
}

#myModal input:focus + .slider_v8xK4z {
    box-shadow: 0 0 1px var(--accent-color-v8xK4z);
}

#myModal input:checked + .slider_v8xK4z:before {
    transform: translateX(22px);
}

#myModal .divider_v8xK4z {
    border: none;
    height: 1px;
    background-color: var(--border-color-v8xK4z);
    margin: 24px 0;
}

#myModal .option-details_v8xK4z {
    grid-column: 1 / -1;
    display: flex;
    gap: 15px;
}

#myModal .mapper-setting_v8xK4z {
    display: inline;
    margin-left: 16px;
}

#myModal .mapper-setting_v8xK4z select {
    background-color: var(--input-bg-v8xK4z); /* 변수 적용 */
    color: var(--primary-text-v8xK4z);
    border: 1px solid var(--border-color-v8xK4z);
    border-radius: 6px;
    padding: 5px 8px;
}

#myModal textarea,
#myModal input[type="text"] {
    grid-column: 1 / -1;
    width: 100%;
    background-color: var(--input-bg-v8xK4z); /* 변수 적용 */
    border: 1px solid var(--border-color-v8xK4z);
    border-radius: 6px;
    color: var(--primary-text-v8xK4z);
    padding: 10px;
    resize: vertical;
}

#myModal .description_v8xK4z {
    font-size: 12px;
    color: var(--secondary-text-v8xK4z);
    margin: 0 0 10px;
}

#myModal .bug-report_v8xK4z a {
    color: var(--accent-color-v8xK4z);
    text-decoration: none;
}

#myModal .bug-report_v8xK4z a:hover {
    text-decoration: underline;
}

#myModal .modal-body_v8xK4z::-webkit-scrollbar,
#myModal .modal-index_v8xK4z::-webkit-scrollbar {
    width: 8px;
}

#myModal .modal-body_v8xK4z::-webkit-scrollbar-track,
#myModal .modal-index_v8xK4z::-webkit-scrollbar-track {
    background: var(--surface-color-v8xK4z);
}

#myModal .modal-body_v8xK4z::-webkit-scrollbar-thumb,
#myModal .modal-index_v8xK4z::-webkit-scrollbar-thumb {
    background-color: var(--border-color-v8xK4z);
    border-radius: 4px;
}

#myModal .modal-body_v8xK4z::-webkit-scrollbar-thumb:hover,
#myModal .modal-index_v8xK4z::-webkit-scrollbar-thumb:hover {
    background-color: var(--scrollbar-thumb-v8xK4z); /* 변수 적용 */
}

/* 여러 옵션을 담는 부모 컨테이너 스타일 */
#myModal .multi-option_v8xK4z {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 0 4px; /* 아이템 사이의 간격 */
    padding: 0;
}

/* 개별 옵션 그룹(레이블+스위치) 스타일 */
#myModal .option-group_v8xK4z {
    display: flex;
    justify-content: space-between;
    align-items: center;

    padding: 8px;
    border-radius: 8px;
    border: 1px solid transparent;
    transition: background-color 0.2s, border-color 0.2s;
}
/* 개별 그룹에 마우스를 올렸을 때의 스타일 */
#myModal .option-group_v8xK4z:hover {
    background-color: var(--hover-bg-v8xK4z); /* 변수 적용 */
    border-color: var(--border-color-v8xK4z);
}
#myModal .subsection-title_v8xK4z {
    margin-top: 20px;
    margin-bottom: 8px;
    margin-left: 8px;
    font-size: 14px;
    color: var(--secondary-text-v8xK4z);
    font-weight: bold;
}
#myModal .order-list_v8xK4z {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 8px;
}
#myModal .draggable-item_v8xK4z {
    background-color: var(--input-bg-v8xK4z); /* 변수 적용 */
    padding: 8px 12px;
    border-radius: 5px;
    border: 1px solid var(--border-color-v8xK4z); /* 변수 적용 */
    cursor: grab;
    transition: background-color 0.2s;
    font-size: 14px;
    white-space: nowrap;
    color: var(--primary-text-v8xK4z); /* 변수 적용 */
}
#myModal .draggable-item_v8xK4z:hover {
    background-color: var(--hover-bg-v8xK4z); /* 변수 적용 */
}
#myModal .draggable-item_v8xK4z.dragging_v8xK4z {
    opacity: 0.5;
    background-color: #5dade2;
    cursor: grabbing;
}

/* =================================================================
    게시글 모달 배경색 설정
================================================================= */
main#main {
    --layout-bg-v8xK4z: #f8f9fa;  /* 밝은 회색 (필요시 #ffffff로 변경 가능) */
    background-color: var(--layout-bg-v8xK4z) !important;
}

html[dark="true"] main#main {
    --layout-bg-v8xK4z: #141517;  /* SOOP 다크모드 배경색 */
}


#openModalBtn {
    box-sizing: border-box;
    font-size: 12px;
    line-height: 1.2 !important;
    font-family: "NG";
    list-style: none;
    position: relative;
    margin-left: 12px;
    width: 40px;
    height: 40px;
}

#topInnerHeader #openModalBtn {
    margin-right: 12px;
}
#openModalBtn > button.btn-settings-ui {
    background: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' fill='none'%3e%3cpath stroke='%23757B8A' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.4' d='M8.269 2.061c.44-1.815 3.022-1.815 3.462 0a1.782 1.782 0 0 0 2.658 1.101c1.595-.971 3.42.854 2.449 2.449a1.781 1.781 0 0 0 1.1 2.658c1.816.44 1.816 3.022 0 3.462a1.781 1.781 0 0 0-1.1 2.659c.971 1.595-.854 3.42-2.449 2.448a1.781 1.781 0 0 0-2.658 1.101c-.44 1.815-3.022 1.815-3.462 0a1.781 1.781 0 0 0-2.658-1.101c-1.595.972-3.42-.854-2.449-2.448a1.782 1.782 0 0 0-1.1-2.659c-1.816-.44-1.816-3.021 0-3.462a1.782 1.782 0 0 0 1.1-2.658c-.972-1.595.854-3.42 2.449-2.449a1.781 1.781 0 0 0 2.658-1.1Z'/%3e%3cpath stroke='%23757B8A' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.4' d='M13.1 10a3.1 3.1 0 1 1-6.2 0 3.1 3.1 0 0 1 6.2 0Z'/%3e%3c/svg%3e") 50% 50% no-repeat !important;
    background-size: 18px !important;
}
html[dark="true"] #openModalBtn > button.btn-settings-ui {
    background: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' fill='none'%3e%3cpath stroke='%23ACB0B9' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.4' d='M8.269 2.061c.44-1.815 3.022-1.815 3.462 0a1.782 1.782 0 0 0 2.658 1.101c1.595-.971 3.42.854 2.449 2.449a1.781 1.781 0 0 0 1.1 2.658c1.816.44 1.816 3.022 0 3.462a1.781 1.781 0 0 0-1.1 2.659c.971 1.595-.854 3.42-2.449 2.448a1.781 1.781 0 0 0-2.658 1.101c-.44 1.815-3.022 1.815-3.462 0a1.781 1.781 0 0 0-2.658-1.101c-1.595.972-3.42-.854-2.449-2.448a1.782 1.782 0 0 0-1.1-2.659c-1.816-.44-1.816-3.021 0-3.462a1.782 1.782 0 0 0 1.1-2.658c-.972-1.595.854-3.42 2.449-2.449a1.781 1.781 0 0 0 2.658-1.1Z'/%3e%3cpath stroke='%23ACB0B9' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.4' d='M13.1 10a3.1 3.1 0 1 1-6.2 0 3.1 3.1 0 0 1 6.2 0Z'/%3e%3c/svg%3e") 50% 50% no-repeat !important;
    background-size: 18px !important;
}
@keyframes rotate {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}
/* .red-dot이 있을 때만 회전 */
#openModalBtn:has(.red-dot) .btn-settings-ui {
    animation: rotate 4s linear infinite;
    animation-duration: 4s; /* 4초에 한 번 회전 */
    animation-iteration-count: 10; /* 10번 반복 */
}
#sidebar.max {
    width: 240px;
}
#sidebar.min {
    width: 52px;
}
#sidebar.min .users-section a.user span {
    display: none;
}
#sidebar.min .users-section button {
    font-size:12px;
    padding: 4px;
}
#sidebar.max .button-fold-sidebar {
    background-size: 7px 11px;
    background-repeat: no-repeat;
    width: 26px;
    height: 26px;
    background-position: center;
    position: absolute;
    top: 13px;
    left: 200px;
}
#sidebar.max .button-unfold-sidebar {
    display:none;
}
#sidebar.min .button-fold-sidebar {
    display:none;
}
#sidebar.min .button-unfold-sidebar {
    background-size: 7px 11px;
    background-repeat: no-repeat;
    width: 26px;
    height: 26px;
    background-position: center;
    position: relative;
    top: 8px;
    left: 12px;
    padding-top:16px;
    padding-bottom:12px;
}
#sidebar.min .top-section span.max{
    display:none;
}
#sidebar.max .top-section span.min{
    display:none;
}
#toggleButton, #toggleButton2, #toggleButton3, #toggleButton4, #toggleButton5 {
    padding: 7px 0px;
    width: 100%;
    text-align: center;
    font-size: 14px;
}

html[dark="true"] #toggleButton,
html[dark="true"] #toggleButton2,
html[dark="true"] #toggleButton3,
html[dark="true"] #toggleButton4,
html[dark="true"] #toggleButton5 {
    color:#A1A1A1;
}

html:not([dark="true"]) #toggleButton,
html:not([dark="true"]) #toggleButton2,
html:not([dark="true"]) #toggleButton3,
html:not([dark="true"]) #toggleButton4,
html:not([dark="true"]) #toggleButton5 {
    color: #53535F;
}

#sidebar {
    grid-area: sidebar;
    padding-bottom: 360px;
    height: 100vh;
    overflow-y: auto;
    position: fixed;
    scrollbar-width: none; /* 파이어폭스 */
    transition: all 0.1s ease-in-out; /* 부드러운 전환 효과 */
}
#sidebar::-webkit-scrollbar {
    display: none;  /* Chrome, Safari, Edge */
}
#sidebar .top-section {
    display: flex;
    align-items: center;
    justify-content: space-around;
    margin: 12px 0px 6px 0px;
    line-height: 17px;
}
#sidebar .top-section > span {
    text-transform: uppercase;
    font-weight: 550;
    font-size: 14px;
    margin-top: 6px;
    margin-bottom: 2px;
}
.users-section .user.show-more {
    max-height: 0;
    opacity: 0;
    padding-top: 0;
    padding-bottom: 0;
    pointer-events: none;
}
.users-section .user {
    display: grid;
    grid-template-areas: "profile-picture username watchers" "profile-picture description blank";
    grid-template-columns: 40px auto auto;
    padding: 5px 10px;
    max-height: 50px;
    opacity: 1;
    overflow: hidden;
    transition: opacity 0.7s ease;
}
.users-section .user:hover {
    cursor: pointer;
}
.users-section .user .profile-picture {
    grid-area: profile-picture;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    line-height: 20px;
}
.users-section .user .username {
    grid-area: username;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 0.6px;
    margin-left:1px;
    line-height: 17px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
.users-section .user .description {
    grid-area: description;
    font-size: 13px;
    font-weight: 400;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-left:1px;
    line-height: 16px;
}
.users-section .user .watchers {
    grid-area: watchers;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    font-weight: 400;
    font-size: 14px;
    margin-right: 2px;
    line-height: 17px;
}
.users-section .user .watchers .dot {
    font-size: 10px;
    margin-right: 5px;
    color: #ff2424;
}
.users-section .user .watchers .dot.greendot {
    color: #34c76b !important;
}
.tooltip-container {
    z-index: 999;
    width: 460px;
    height: auto;
    position: fixed;
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 10px;
    box-shadow: 5px 5px 10px 0px rgba(0, 0, 0, 0.5);
    opacity: 0;
    transition: opacity 0.1s ease-in-out;
    pointer-events: none;
}

.tooltip-container.visible {
    opacity: 1;
    pointer-events: auto;
}

.tooltip-container img {
    z-index: 999;
    width: 100%; /* 컨테이너의 너비에 맞게 확장 */
    height: 260px; /* 고정 높이 */
    object-fit: cover; /* 비율 유지하며 공간에 맞게 잘리기 */
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    border-bottom-left-radius: 0px;
    border-bottom-right-radius: 0px;
}

.tooltiptext {
    position: relative;
    z-index: 999;
    width: 100%;
    max-width: 460px;
    height: auto;
    text-align: center;
    box-sizing: border-box;
    padding: 14px 20px;
    font-size: 17px;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    line-height: 22px;
    overflow-wrap: break-word;
}

.tooltiptext .dot {
    font-size: 11px;
    margin-right: 2px;
    vertical-align: middle;
    line-height: 22px;
    display: inline-block;
}

.profile-grayscale {
    filter: grayscale(100%) contrast(85%);
    opacity: .8;
}

#sidebar.max .small-user-layout.show-more {
    max-height: 0;
    opacity: 0;
    padding: 0 !important;
    pointer-events: none;
}
#sidebar.max .small-user-layout {
    grid-template-areas: "profile-picture username description watchers" !important;
    grid-template-columns: 24px auto 1fr auto !important;
    padding: 4px 10px !important;
    gap: 8px !important;
    max-height: 32px;
    opacity: 1;
    overflow: hidden;
    transition: opacity 0.4s ease;
}
#sidebar.max .small-user-layout .profile-picture {
    width: 24px !important;
    height: 24px !important;
    border-radius: 20% !important;
    object-fit: cover;
}
#sidebar.max .small-user-layout .username {
    max-width: 80px !important;
    font-size: 14px !important;
    line-height: 24px !important;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
#sidebar.max .small-user-layout .description {
    font-size: 12px !important;
    line-height: 24px !important;
}
#sidebar.max .small-user-layout .watchers {
    font-size: 14px !important;
    line-height: 24px !important;
}
#sidebar.max .small-user-layout .watchers .dot {
    font-size: 8px !important;
    margin-right: 4px !important;
}

.customSidebar #serviceHeader .a_d_banner {
    display: none !important;
}
.customSidebar #serviceHeader .btn_flexible+.logo_wrap {
    left: 24px !important;
}
.customSidebar #serviceHeader .logo_wrap {
    left: 24px !important;
}


html[dark="true"] .users-section .user.user-offline span {
    filter: grayscale(1) brightness(0.8); /* 다크모드: 완전 흑백과 약간 어둡게 */
}

html:not([dark="true"]) .users-section .user.user-offline span {
    opacity: 0.7; /* 밝은 모드: 투명하게 */
}


/* darkMode Sidebar Styles */

html[dark="true"] #sidebar.max .button-fold-sidebar {
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none slice' viewBox='0 0 7 11'%3e%3cpath fill='%23f9f9f9' d='M5.87 11.01L.01 5.51 5.87.01l1.08 1.01-4.74 4.45L7 9.96 5.87 11z'/%3e%3c/svg%3e");
}
html[dark="true"] #sidebar.min .button-unfold-sidebar {
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none slice' viewBox='0 0 7 11'%3e%3cpath fill='%23f9f9f9' d='M1.13 11.01l5.86-5.5L1.13.01.05 1.02l4.74 4.45L0 9.96 1.13 11z'/%3e%3c/svg%3e");
}
html[dark="true"] #sidebar {
    color: white;
    background-color: #1F1F23;
}
html[dark="true"] #sidebar .top-section > span {
    color:#DEDEE3;
}
html[dark="true"] #sidebar .top-section > span > a {
    color:#DEDEE3;
}
html[dark="true"] .users-section .user:hover {
    background-color: #26262c;
}
html[dark="true"] .users-section .user .username {
    color:#DEDEE3;
}
html[dark="true"] .users-section .user .description {
    color: #a1a1a1;
}
html[dark="true"] .users-section .user .watchers {
    color: #c0c0c0;
}
html[dark="true"] .tooltip-container {
    background-color: #26262C;
}
html[dark="true"] .tooltiptext {
    color: #fff;
    background-color: #26262C;
}

/* whiteMode Sidebar Styles */

html:not([dark="true"]) #sidebar.max .button-fold-sidebar {
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none slice' viewBox='0 0 7 11'%3e%3cpath fill='%23888' d='M5.87 11.01L.01 5.51 5.87.01l1.08 1.01-4.74 4.45L7 9.96 5.87 11z'/%3e%3c/svg%3e");
}
html:not([dark="true"]) #sidebar.min .button-unfold-sidebar {
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none slice' viewBox='0 0 7 11'%3e%3cpath fill='%23888' d='M1.13 11.01l5.86-5.5L1.13.01.05 1.02l4.74 4.45L0 9.96 1.13 11z'/%3e%3c/svg%3e");
}
html:not([dark="true"]) #sidebar {
    color: white;
    background-color: #EFEFF1;
}
html:not([dark="true"]) #sidebar .top-section > span {
    color:#0E0E10;
}
html:not([dark="true"]) #sidebar .top-section > span > a {
    color:#0E0E10;
}
html:not([dark="true"]) .users-section .user:hover {
    background-color: #E6E6EA;
}
html:not([dark="true"]) .users-section .user .username {
    color:#1F1F23;
}
html:not([dark="true"]) .users-section .user .description {
    color: #53535F;
}
html:not([dark="true"]) .users-section .user .watchers {
    color: black;
}
html:not([dark="true"]) .tooltip-container {
    background-color: #E6E6EA;
}
html:not([dark="true"]) .tooltiptext {
    color: black;
    background-color: #E6E6EA;
}

#cps_display { position: absolute; top: 8px; left: 8px; background: rgba(0, 0, 0, 0.5); color: #fff; font-size: 14px; padding: 4px 8px; border-radius: 4px; z-index: 10; pointer-events: none; }
.chat-icon { position: absolute; bottom: 10px; right: 6px; width: 24px; height: 24px; cursor: pointer; z-index: 1000; background-size: contain; background-repeat: no-repeat; }
.chat-icon.highlight { right: 7px; width: 22px; height: 22px; bottom: ${highlightButtonPosition}; }
.chat-icon.statistics { right: 7px; width: 22px; height: 22px; bottom: ${statisticsButtonPosition}; }
html:not([dark="true"]) .trash-icon { background-image: url("data:image/svg+xml,%3Csvg%20width%3D%2264%22%20height%3D%2264%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20stroke%3D%22%23000%22%20stroke-width%3D%220%22%3E%3Cg%2F%3E%3Cg%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke%3D%22%23CCC%22%20stroke-width%3D%22.192%22%2F%3E%3Cg%20fill%3D%22%236A6A75%22%20stroke%3D%22none%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20clip-rule%3D%22evenodd%22%20d%3D%22M10.31%202.25h3.38c.217%200%20.406%200%20.584.028a2.25%202.25%200%200%201%201.64%201.183c.084.16.143.339.212.544l.111.335.03.085a1.25%201.25%200%200%200%201.233.825h3a.75.75%200%200%201%200%201.5h-17a.75.75%200%200%201%200-1.5h3.09a1.25%201.25%200%200%200%201.173-.91l.112-.335c.068-.205.127-.384.21-.544a2.25%202.25%200%200%201%201.641-1.183c.178-.028.367-.028.583-.028Zm-1.302%203a3%203%200%200%200%20.175-.428l.1-.3c.091-.273.112-.328.133-.368a.75.75%200%200%201%20.547-.395%203%203%200%200%201%20.392-.009h3.29c.288%200%20.348.002.392.01a.75.75%200%200%201%20.547.394c.021.04.042.095.133.369l.1.3.039.112q.059.164.136.315z%22%2F%3E%3Cpath%20d%3D%22M5.915%208.45a.75.75%200%201%200-1.497.1l.464%206.952c.085%201.282.154%202.318.316%203.132.169.845.455%201.551%201.047%202.104s1.315.793%202.17.904c.822.108%201.86.108%203.146.108h.879c1.285%200%202.324%200%203.146-.108.854-.111%201.578-.35%202.17-.904.591-.553.877-1.26%201.046-2.104.162-.813.23-1.85.316-3.132l.464-6.952a.75.75%200%200%200-1.497-.1l-.46%206.9c-.09%201.347-.154%202.285-.294%202.99-.137.685-.327%201.047-.6%201.303-.274.256-.648.422-1.34.512-.713.093-1.653.095-3.004.095h-.774c-1.35%200-2.29-.002-3.004-.095-.692-.09-1.066-.256-1.34-.512-.273-.256-.463-.618-.6-1.302-.14-.706-.204-1.644-.294-2.992z%22%2F%3E%3Cpath%20d%3D%22M9.425%2010.254a.75.75%200%200%201%20.821.671l.5%205a.75.75%200%200%201-1.492.15l-.5-5a.75.75%200%200%201%20.671-.821m5.15%200a.75.75%200%200%201%20.671.82l-.5%205a.75.75%200%200%201-1.492-.149l.5-5a.75.75%200%200%201%20.82-.671Z%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E"); }
html[dark="true"] .trash-icon { background-image: url("data:image/svg+xml,%3Csvg%20width%3D%2264%22%20height%3D%2264%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20stroke%3D%22%23000%22%20stroke-width%3D%220%22%3E%3Cg%2F%3E%3Cg%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke%3D%22%23CCC%22%20stroke-width%3D%22.192%22%2F%3E%3Cg%20fill%3D%22%2394949C%22%20stroke%3D%22none%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20clip-rule%3D%22evenodd%22%20d%3D%22M10.31%202.25h3.38c.217%200%20.406%200%20.584.028a2.25%202.25%200%200%201%201.64%201.183c.084.16.143.339.212.544l.111.335.03.085a1.25%201.25%200%200%200%201.233.825h3a.75.75%200%200%201%200%201.5h-17a.75.75%200%200%201%200-1.5h3.09a1.25%201.25%200%200%200%201.173-.91l.112-.335c.068-.205.127-.384.21-.544a2.25%202.25%200%200%201%201.641-1.183c.178-.028.367-.028.583-.028Zm-1.302%203a3%203%200%200%200%20.175-.428l.1-.3c.091-.273.112-.328.133-.368a.75.75%200%200%201%20.547-.395%203%203%200%200%201%20.392-.009h3.29c.288%200%20.348.002.392.01a.75.75%200%200%201%20.547.394c.021.04.042.095.133.369l.1.3.039.112q.059.164.136.315z%22%2F%3E%3Cpath%20d%3D%22M5.915%208.45a.75.75%200%201%200-1.497.1l.464%206.952c.085%201.282.154%202.318.316%203.132.169.845.455%201.551%201.047%202.104s1.315.793%202.17.904c.822.108%201.86.108%203.146.108h.879c1.285%200%202.324%200%203.146-.108.854-.111%201.578-.35%202.17-.904.591-.553.877-1.26%201.046-2.104.162-.813.23-1.85.316-3.132l.464-6.952a.75.75%200%200%200-1.497-.1l-.46%206.9c-.09%201.347-.154%202.285-.294%202.99-.137.685-.327%201.047-.6%201.303-.274.256-.648.422-1.34.512-.713.093-1.653.095-3.004.095h-.774c-1.35%200-2.29-.002-3.004-.095-.692-.09-1.066-.256-1.34-.512-.273-.256-.463-.618-.6-1.302-.14-.706-.204-1.644-.294-2.992z%22%2F%3E%3Cpath%20d%3D%22M9.425%2010.254a.75.75%200%200%201%20.821.671l.5%205a.75.75%200%200%201-1.492.15l-.5-5a.75.75%200%200%201%20.671-.821m5.15%200a.75.75%200%200%201%20.671.82l-.5%205a.75.75%200%200%201-1.492-.149l.5-5a.75.75%200%200%201%20.82-.671Z%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E"); }
html:not([dark="true"]) .highlight-icon { color: black; background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAADyUlEQVR4nO1YTWhdVRA+/TH+Ba3gorgQFBS0ulEsqItXFCWLmuZ8k0GSvDtzo/C0YFu0+IfIU7rQnSKCIIo7XYmRIiL+oCsRBbFimwr+ddOVWKy2aovK5OYl552Q9+59P7kp3A8O5OWe+c7MnJk5c45zFSpUqFBhLTA9PX3Z5KTMAjoHyDygfwByGtAfAX3Te/HMvKkbj80hSgHIW5nsAodxzRPJO4Cmu3bploEpzswXAvIkICeI9L/OQ44wJ7euxkWU3mZzcvD8BugTqnpBX8qPj993BaBfdl+wbZwxg51zG1o8zWZzI6BP2bciXIB+YTr0rDyRHIsIvyHSvcyz19fr9YvNQ/Y3oPuJ5OfIiy+1uAB5Ofr2E5E8PDGRXGccxkUk2wDZB8ihaO6xwkZkYRN6Xv6anJQHzJOdZEzpyIvPEMmz0f9e7BQazWZzI5E+aGuGO1EonCwEQuWZk1p+WX109ZBIHsnLQ6Q7IiMey11twoQ1z+dddHlxeW2l8vJqUR5AdoeJnas6WakMY75T2KyGnTsbFxHpt4HyhyzEivIw86b2nEi0q5DV4sBze12PmJhIrl2s7UeA9JpeeQDZFzji7a4CRHq0JWAVxpUMItkWGDDfVQDQk8sG8KgrGcw8GoT0ya4Cdqy3BGZmZi5xJYO5cWlBAyxulzL/blcyvNexICcPdxWwclcoaYYMQOcCfV7pKkCkdwYW/8ss211JYNabTYdAnx155DYs9jytMPq4l7OgXzSzluKTwPtf5xb2Pr0jauL2uzUGVrQkBfORSN4IrP9nLUPJ+/QmQP8O1n+9MEnW4urhsAVm1q1uyGDWrVm7vaT8d9aa9EiW3gjoqSCUvhrm4cbMo7ZGsN4p7+s39EUKKAF6NtiJ92q12mY3YNRqtc3GHSh/1u7OAyG3ljpK6oNjY3vOHwi5c67RaJxnZ064hve6xw0SRHogMmKOmUf65WXmkfCwWhwH3DAQG0Ek7/fzcsDMI0T6bsT5ghsmsntu20580MtlxUIQ0INrqnwLRPp0tOUfFil1NheQj0pRvgUieTzaiU/ztN82h0g/i5R/zpWBxUv3UrNlNXxqauryTg8GRPJ5ZPjzrkwA8lC7EXaBX3liZyfs8kXfZPygS2WvIJJ6+GyYPdrOXt36zpxcSSTfh4cUoPe79QQgudeavkDJX+xlgrl+FZH8EHj+DKCJW4/wXsbbX9PkuI3g92kgvcetZ1D2JPh7/DJHJH96n97lzgV4n94CyK+B508Aers7l8AL99mFxD1qF5Sy9alQoUIFNxT8D3rbJQHjF4hlAAAAAElFTkSuQmCC"); }
html[dark="true"] .highlight-icon { color: white; background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAD1ElEQVR4nO2YXYhVVRTHd6NZ1tAH9CA9CAYJZb4oCdVDUhS9GFQPvSgWPViQiklmRJzCh3orIgijGFAo2Gf9z5mud85aZ6Y69SSSEBrlFGTli0+hqGkf0sSac+/Mvnvy3nvu5wjnBxcunLP+e6191tp77W1MSUlJSckgqFartwLyLJGMAzIN8AWALwF8EpBPgOQJa+2SVjr6ThTxk0T8aW47q3GhphkT8TNxnN3SM8ettcuJ+FWAzwIy0/zHJ6KI77uSVhjK/fpOKx0iPkMke8fGsuu7cn58fPJ2gL9p7XjD4P9owDMzM9fUdYIgGCGS1/RZQa0j6kPHzhPxKU/0GMA7rE3uPnAgvVFnSP8TyW5AfvUGf6+uRSTvNz6TX4B0VxRN3qUaqhWGvIaIdxLJcU/nVOEgNG3cmSeSPwHepjPZzEad9lLqDYDf9Cbh3WapEQTBSBTx8/mY81+iUDrlOT/vfBQlDxawfblJSrzUrk4Y8kYviD0FVhu3YHmbKQggH/2P8x8W1SGSF9zCbmt10qXSzflmaXMlKpXKDUT8nfMVj2uKFdWx1i5xayIM061tBMCxM/s7TIdE0cTq2tp+gmjyzk51iHinMxFow0B+rBvoCmOGTBjyGicjplsaAHx+PoBs1AwZa7NRJyPOtzSobeuzBgcPJjeZIWPt1M0FA9C8nSuaRwfiZRMAecxZiX4wrdDlrlDR9BnKm8e6Px+0NAjD5GEn4n+jSDaYIRHH6Xr1YT4jeGNLI23C8p5nLogvOtkLuiUIghGAv3T8+LZtYyB9yGu+dpsBQ15LUrgeARlzqv/vQaYSwOsA+csZ/+PCItriatW7LbC11RWmz1hbXZG323Oz/722Jh2JxfHEWkAuOnl4tJ+bm7XZqI7hOH8RSO/pSpRIngLksiM6kWXZUtNjsixbqtrOOJf17NwTcW2pvdb4UJIk1/VE3Bizf//Ra3XP8Vrw7aaXALLPW5nGrbXLutW11i5zN6vab5/pBwuDYO7m5sDmzn/mab5j+kl+zm0496adHFY0BYn40ECdrwPw694nnyqy1Om7gHw+FOfrAPKKVxNftdN+6zsAf+19xbfMMNBDt9ts6RpeqVRua3ZhQCSHvZl/2wwTInmxMQg9wC/csfMd1j3oz9psN4uBMEw2N14b8kmiqTvqz62dWgnwT+4mRZQ8ZxYTRPK0Nn1OEL/pzYS16SqAf/buTreYxQjAj7u3aYCcrv3qQV0iSjeZxUyYXwmeW3gzJ38A8oi5GgCSewH+3Zn5s0TpA+ZqIo7T9Vq4+UUZrxu2PyUlJSWmL/wH5eEJ5sFzGH4AAAAASUVORK5CYII="); }
html:not([dark="true"]) .statistics-icon_54334 { color: black; background-image: url("data:image/svg+xml,%3Csvg%20width%3D%2264px%22%20height%3D%2264px%22%20viewBox%3D%220%200%2024%2024%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22%235C5C66%22%3E%3Cg%20id%3D%22SVGRepo_bgCarrier%22%20stroke-width%3D%220%22%3E%3C%2Fg%3E%3Cg%20id%3D%22SVGRepo_tracerCarrier%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke%3D%22%23CCCCCC%22%20stroke-width%3D%220.048%22%3E%3C%2Fg%3E%3Cg%20id%3D%22SVGRepo_iconCarrier%22%3E%3Cdefs%3E%3Cstyle%3E.a%7Bfill%3Anone%3Bstroke%3A%235C5C66%3Bstroke-linecap%3Around%3Bstroke-linejoin%3Around%3Bstroke-width%3A1.5px%3Bfill-rule%3Aevenodd%3B%7D%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cpath%20class%3D%22a%22%20d%3D%22M12%2C2A10%2C10%2C0%2C1%2C0%2C22%2C12H12Z%22%3E%3C%2Fpath%3E%3Cpath%20class%3D%22a%22%20d%3D%22M15%2C9h6.54077A10.02174%2C10.02174%2C0%2C0%2C0%2C15%2C2.45923Z%22%3E%3C%2Fpath%3E%3C%2Fg%3E%3C%2Fsvg%3E"); }
html[dark="true"] .statistics-icon_54334 { color: white; background-image: url("data:image/svg+xml,%3Csvg%20width%3D%2264px%22%20height%3D%2264px%22%20viewBox%3D%220%200%2024%2024%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22%23B0B0BA%22%20stroke%3D%22%23B0B0BA%22%3E%3Cg%20id%3D%22SVGRepo_bgCarrier%22%20stroke-width%3D%220%22%3E%3C%2Fg%3E%3Cg%20id%3D%22SVGRepo_tracerCarrier%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke%3D%22%23CCCCCC%22%20stroke-width%3D%220.048%22%3E%3C%2Fg%3E%3Cg%20id%3D%22SVGRepo_iconCarrier%22%3E%3Cdefs%3E%3Cstyle%3E.a%7Bfill%3Anone%3Bstroke%3A%23B0B0BA%3Bstroke-linecap%3Around%3Bstroke-linejoin%3Around%3Bstroke-width%3A1.5px%3Bfill-rule%3Aevenodd%3B%7D%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cpath%20class%3D%22a%22%20d%3D%22M12%2C2A10%2C10%2C0%2C1%2C0%2C22%2C12H12Z%22%3E%3C%2Fpath%3E%3Cpath%20class%3D%22a%22%20d%3D%22M15%2C9h6.54077A10.02174%2C10.02174%2C0%2C0%2C0%2C15%2C2.45923Z%22%3E%3C%2Fpath%3E%3C%2Fg%3E%3C%2Fsvg%3E"); }

/*----- preview-modal 시작 -----*/

.preview-modal {
    display: none;
    position: fixed;
    z-index: 10000;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background-color: rgba(0, 0, 0, 0.9);
    backdrop-filter: blur(5px);
}

.preview-modal-content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 0;
    width: 80%;
    max-width: 800px;
    max-height: 800px;
    border-radius: 10px;
    border: 1px solid #cccccc52;
    overflow: hidden;
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.7);
    pointer-events: auto;
}

.preview-modal .preview-close {
    position: absolute;
    top: 10px;
    right: 15px;
    color: #fff;
    font-size: 30px;
    font-weight: bold;
    cursor: pointer;
    transition: color 0.3s ease;
    z-index: 10;
}

.preview-modal .preview-close:hover,
.preview-modal .preview-close:focus {
    color: #e50914;
}

.preview-modal .thumbnail-container {
    position: relative;
    width: 100%;
    height: 450px;
    background-color: black;
    display: flex;
    justify-content: center;
    align-items: center;
}

.preview-modal .thumbnail-container img {
    max-width: 100%;
    max-height: 100%;
    object-fit: cover;
}

.preview-modal .preview-modal-content video {
    width: clamp(100%, 50vw, 800px);
    height: 449px;
    display: none;
}

.preview-modal .info {
    color: white;
    text-align: left;
    padding: 28px;
    background-color: rgba(0, 0, 0, 0.65);
}

.preview-modal .streamer-name {
    font-size: 50px;
    font-weight: bold;
    letter-spacing: -2px;
}

.preview-modal .video-title {
    font-size: 20px;
    margin: 20px 0 30px 0;
}

.preview-modal .tags {
    display: flex;
    justify-content: left;
    flex-wrap: wrap;
    flex-direction: row;
    margin-left: -3px;
}

.preview-modal .tags a {
    margin: 5px;
    color: white;
    text-decoration: none;
    border: 1px solid #fff;
    padding: 5px 10px;
    border-radius: 5px;
    transition: background-color 0.3s;
}

.preview-modal .tags a:hover {
    background-color: rgba(255, 255, 255, 0.2);
}

.preview-modal .start-button {
    background-color: #2d6bffba;
    color: white;
    padding: 12px 20px;
    border: none;
    border-radius: 5px;
    font-size: 22px;
    cursor: pointer;
    display: inline-block; /* inline-block으로 변경 */
    width: auto; /* 너비는 자동으로 */
    text-align: center;
    text-decoration: none;
    transition: background-color 0.3s;
}

.preview-modal .start-button:hover {
    background-color: #2d6bff8f;
}

/*----- preview-modal 끝 -----*/
    #category-group-wrapper,
    #favorite-group-wrapper {
        position: relative;
        margin-bottom: 5px;
    }
    #sidebar.min #category-group-wrapper,
    #sidebar.min #favorite-group-wrapper {
        display: none !important;
    }
    .fav-group-scroll-btn {
        position: absolute;
        top: -1px;
        width: 32px;
        height: 100%;
        border: none;
        font-size: 24px;
        font-weight: bold;
        z-index: 10;
        display: flex;
        align-items: center;
        justify-content: center;
        visibility: hidden;
        opacity: 0;
        color: transparent;
        cursor: default;
        transition: opacity 0.2s, visibility 0.2s, color 0.2s;
    }
    .fav-group-scroll-btn.visible {
        visibility: visible;
        opacity: 1;
    }
    #category-group-wrapper:hover .fav-group-scroll-btn.visible,
    #favorite-group-wrapper:hover .fav-group-scroll-btn.visible {
        cursor: pointer;
    }

    /* [수정] ID 선택자를 클래스 선택자로 변경 */
    .scroll-btn-left { left: 0; }
    .scroll-btn-right { right: 0; }

    #favorite-group-tabs,
    #category-group-tabs {
        display: flex;
        align-items: center;
        overflow-x: auto;
        overflow-y: hidden;
        box-sizing: border-box;
        scrollbar-width: none;
        -ms-overflow-style: none;
        margin-left: 5px;
    }
    #favorite-group-tabs::-webkit-scrollbar,
    #category-group-tabs::-webkit-scrollbar {
        display: none;
    }
    .fav-group-tab {
        flex-shrink: 0;
        padding: 4px 10px;
        margin: 0 3px;
        cursor: pointer;
        border-radius: 15px;
        font-size: 13px;
        border: 1px solid transparent;
        transition: background-color 0.2s, color 0.2s;
    }
    .fav-group-tab.active {
        font-weight: bold;
    }

    /* --- 다크 모드 스타일 --- */
    html[dark="true"] #favorite-group-wrapper:hover .fav-group-scroll-btn.visible,
    html[dark="true"] #category-group-wrapper:hover .fav-group-scroll-btn.visible { /* [추가] 카테고리 래퍼용 hover 선택자 */
        color: #DEDEE3;
    }

    /* [수정] ID 선택자를 클래스 선택자로 변경 */
    html[dark="true"] .scroll-btn-left { background: linear-gradient(to right, #1F1F23, rgba(31, 31, 35, 0)); }
    html[dark="true"] .scroll-btn-right { background: linear-gradient(to left, #1F1F23, rgba(31, 31, 35, 0)); }

    html[dark="true"] .fav-group-tab { background-color: #2c2c31; color: #DEDEE3; }
    html[dark="true"] .fav-group-tab:hover { background-color: #3e3e44; }
    html[dark="true"] .fav-group-tab.active { background-color: #424242; }

    /* --- 화이트 모드 스타일 --- */
    html:not([dark="true"]) #favorite-group-wrapper:hover .fav-group-scroll-btn.visible,
    html:not([dark="true"]) #category-group-wrapper:hover .fav-group-scroll-btn.visible { /* [추가] 카테고리 래퍼용 hover 선택자 */
        color: #53535F;
    }

    /* [수정] ID 선택자를 클래스 선택자로 변경 */
    html:not([dark="true"]) .scroll-btn-left { background: linear-gradient(to right, #EFEFF1, rgba(239, 239, 241, 0)); }
    html:not([dark="true"]) .scroll-btn-right { background: linear-gradient(to left, #EFEFF1, rgba(239, 239, 241, 0)); }

    html:not([dark="true"]) .fav-group-tab { background-color: #E6E6EA; color: #53535F; }
    html:not([dark="true"]) .fav-group-tab:hover { background-color: #DCDDE1; }
    html:not([dark="true"]) .fav-group-tab.active { background-color: #d2d2d2; }

    `;
  //html:not([dark="true"]) (화이트)	#6A6A75
  //html[dark="true"] (다크)	#94949C

  const mainPageCommonStyles = `

._moreDot_layer button {
    text-align: left;
}

.customSidebar .btn_flexible {
    display: none;
}
#sidebar {
    z-index: 1401;
}

body.customSidebar main {
    padding-left: 238px !important;
}

body.customSidebar .catch_webplayer_wrap {
    margin-left: 24px !important;
}

    `;

  const playerCommonStyles = `
.default_logo.on { z-index: 0 !important; }
.screen_mode .left_navbar,
.fullScreen_mode .left_navbar {
    display: none;
}

.customSidebar .btn_flexible {
    display: none;
}

/* 스크롤바 스타일링 */
html {
    overflow: auto; /* 스크롤 기능 유지 */
}

/* Firefox 전용 스크롤바 감추기 */
html::-webkit-scrollbar {
    display: none; /* 크롬 및 사파리에서 */
}

/* Firefox에서는 아래와 같이 처리 */
html {
    scrollbar-width: none; /* Firefox에서 스크롤바 감추기 */
    -ms-overflow-style: none; /* Internet Explorer 및 Edge */
}

.customSidebar #player,
.customSidebar #webplayer #webplayer_contents #player_area .float_box,
.customSidebar #webplayer #webplayer_contents #player_area
{
    min-width: 180px !important;
}

.customSidebar.screen_mode #webplayer,
.customSidebar.screen_mode #sidebar
{
    transition: all 0.25s ease-in-out !important;
}

@media screen and (max-width: 892px) {
    .screen_mode.bottomChat #webplayer #player .view_ctrl,
    .screen_mode.bottomChat #webplayer .wrapping.side {
        display: block !important;
    }
}

.customSidebar #webplayer_contents {
    width: calc(100vw - ${WEB_PLAYER_SCROLL_LEFT}px) !important;
    gap:0 !important;
    padding: 0 !important;
    margin: 64px 0 0 !important;
    left: ${WEB_PLAYER_SCROLL_LEFT}px !important;
}

.customSidebar.top_hide #webplayer_contents,
.customSidebar.top_hide #sidebar {
    top: 0 !important;
    margin-top: 0 !important;
    min-height: 100vh !important;
}

/* sidebar가 .max 클래스를 가질 때, body에 .screen_mode가 없을 경우 */
body:not(.screen_mode):not(.fullScreen_mode):has(#sidebar.max) #webplayer_contents {
    width: calc(100vw - 240px) !important;
    left: 240px !important;
}

/* sidebar가 .min 클래스를 가질 때, body에 .screen_mode가 없을 경우 */
body:not(.screen_mode):not(.fullScreen_mode):has(#sidebar.min) #webplayer_contents {
    width: calc(100vw - 52px) !important;
    left: 52px !important;
}

.customSidebar.screen_mode #webplayer #webplayer_contents,
.customSidebar.fullScreen_mode #webplayer #webplayer_contents {
    top: 0 !important;
    left: 0 !important;
    width: 100vw;
    height: 100vh !important;
    margin: 0 !important;
}

.customSidebar.screen_mode #sidebar{
    top: 0 !important;
}

.customSidebar.screen_mode #sidebar .button-fold-sidebar,
.customSidebar.screen_mode #sidebar .button-unfold-sidebar
{
    display: none !important;
}

.customSidebar.screen_mode.showSidebar #sidebar{
    display: flex !important;
}

.customSidebar.screen_mode #webplayer_contents,
.customSidebar.fullScreen_mode #webplayer_contents{
    width: 100vw !important
}

.customSidebar.screen_mode.showSidebar:has(#sidebar.min) #webplayer_contents {
    width: calc(100vw - 52px) !important
}
.customSidebar.screen_mode.showSidebar:has(#sidebar.max) #webplayer_contents {
    width: calc(100vw - 240px) !important
}

.screen_mode.bottomChat #webplayer #webplayer_contents {
    top: 0 !important;
    margin: 0 !important;
}

.screen_mode.bottomChat #player {
    min-height: auto !important;
}

.screen_mode.bottomChat #webplayer #webplayer_contents {
    position: relative;
    box-sizing: border-box;
    flex: auto;
    display: flex;
    flex-direction: column !important;
    justify-content:flex-start !important;
}

.screen_mode.bottomChat #webplayer #webplayer_contents .wrapping.side {
    width: 100% !important;
    max-height: calc(100vh - (100vw * 9 / 16)) !important;
}

.screen_mode.bottomChat.showSidebar:has(#sidebar.min) #webplayer #webplayer_contents .wrapping.side {
    width: 100% !important;
    max-height: calc(100vh - ((100vw - 52px) * 9 / 16)) !important;
}
.screen_mode.bottomChat.showSidebar:has(#sidebar.max) #webplayer #webplayer_contents .wrapping.side {
    width: 100% !important;
    max-height: calc(100vh - ((100vw - 240px) * 9 / 16)) !important;
}

.screen_mode.bottomChat #webplayer #webplayer_contents .wrapping.side section.box.chatting_box {
    height: 100% !important;
}

.screen_mode.bottomChat #webplayer #webplayer_contents .wrapping.side section.box.chatting_box #chatting_area {
    height: 100% !important;
    min-height: 10vh !important;
}

.screen_mode.bottomChat #webplayer #webplayer_contents #player_area .htmlplayer_wrap,
.screen_mode.bottomChat #webplayer #webplayer_contents #player_area .htmlplayer_content,
.screen_mode.bottomChat #webplayer #webplayer_contents #player_area .float_box,
.screen_mode.bottomChat #webplayer #webplayer_contents #player_area #player {
    height: auto !important;
    max-height: max-content;
}

.customSidebar #player {
    max-height: 100vh !important;
}

`;

  //======================================
  // 3. 함수 정의 (Function Definitions)
  //======================================

  // 3.1. API 및 데이터 호출 함수 (API & Data Fetching)

  const fetchFavoriteGroups = async () => {
    const response = await fetchBroadList("https://myapi.sooplive.co.kr/api/favorite/group/list", 50);
    return response?.data || [];
  };

  const getHiddenbjList = async () => {
    const url = "https://live.sooplive.co.kr/api/hiddenbj/hiddenbjController.php";

    const response = await fetchBroadList(url, 25);

    if (response?.RESULT === 1) {
      return response.DATA || [];
    } else {
      return [];
    }
  };
  const getStationFeed = async () => {
    // 채널 피드가 비활성화된 경우 빈 배열을 반환합니다.
    if (!isChannelFeedEnabled) {
      return [];
    }

    const feedUrl = "https://myapi.sooplive.co.kr/api/feed?index_reg_date=0&user_id=&is_bj_write=1&feed_type=&page=1";
    const response = await fetchBroadList(feedUrl, 150);

    return response?.data || [];
  };

  const loadCategoryData = () => {
    // 현재 시간 기록
    const currentTime = new Date().getTime();

    // 이전 실행 시간 불러오기
    const lastExecutionTime = GM_getValue("lastExecutionTime", 0);

    // 마지막 실행 시간으로부터 15분 이상 경과했는지 확인
    if (currentTime - lastExecutionTime >= 900000) {
      // URL에 현재 시간을 쿼리 스트링으로 추가해서 캐시 방지
      const url = "https://live.sooplive.co.kr/script/locale/ko_KR/broad_category.js?" + currentTime;

      GM_xmlhttpRequest({
        method: "GET",
        url: url,
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
        },
        onload: function (response) {
          if (response.status === 200) {
            // 성공적으로 데이터를 받았을 때 처리할 코드 작성
            let szBroadCategory = response.responseText;
            customLog.log(szBroadCategory);
            // 이후 처리할 작업 추가
            szBroadCategory = JSON.parse(szBroadCategory.split("var szBroadCategory = ")[1].slice(0, -1));
            if (szBroadCategory.CHANNEL.RESULT === "1") {
              // 데이터 저장
              GM_setValue("szBroadCategory", szBroadCategory);
              // 현재 시간을 마지막 실행 시간으로 업데이트
              GM_setValue("lastExecutionTime", currentTime);
            }
          } else {
            customLog.error("Failed to load data:", response.statusText);
          }
        },
        onerror: function (error) {
          customLog.error("Error occurred while loading data:", error);
        },
      });
    }
  };
  const fetchBroadList = async (url, expiry_seconds = 50, timeout = 5000) => {
    const CACHE_EXPIRY_MS = expiry_seconds * 1000; // 기본값 50초
    const cacheKey = `fetchCache_${encodeURIComponent(url)}`;

    // (신규) 캐시 파싱 및 유효성 검사 헬퍼 함수
    const _parseAndValidateCache = (cachedDataString) => {
      if (!cachedDataString) return null;
      try {
        const { timestamp, data } = JSON.parse(cachedDataString);
        if (Date.now() - timestamp < CACHE_EXPIRY_MS) {
          return data;
        }
      } catch (e) {
        customLog.warn(url, "Cache parse error, ignoring.", e);
      }
      return null;
    };

    // 1. LocalStorage 확인 (개선된 로직 적용)
    const localData = _parseAndValidateCache(localStorage.getItem(cacheKey));
    if (localData) return localData;

    // 2. GM 저장소 확인 (개선된 로직 적용)
    const gmDataString = await GM_getValue(cacheKey, null);
    const gmData = _parseAndValidateCache(gmDataString);
    if (gmData) {
      // GM 저장소에 유효한 캐시가 있다면, 더 빠른 접근을 위해 LocalStorage에도 저장
      localStorage.setItem(cacheKey, gmDataString);
      return gmData;
    }

    // 3. 요청 수행
    return new Promise((resolve) => {
      let timeoutId;

      if (timeout) {
        timeoutId = setTimeout(() => {
          customLog.error(url, `Request timed out after ${timeout} ms`);
          resolve([]);
        }, timeout);
      }

      GM_xmlhttpRequest({
        method: "GET",
        url: url,
        headers: {
          "Content-Type": "application/json",
        },
        onload: async (response) => {
          if (timeoutId) clearTimeout(timeoutId);

          try {
            if (response.status >= 200 && response.status < 300) {
              const jsonResponse = JSON.parse(response.responseText);

              // 에러 응답 처리
              if (jsonResponse?.RESULT === -1 || (jsonResponse?.code && jsonResponse.code < 0)) {
                customLog.error(url, `API Error (Login Required or other): ${jsonResponse.MSG || jsonResponse.message}`);
                localStorage.removeItem(cacheKey);
                await GM_setValue(cacheKey, ""); // GM 저장소도 삭제 (빈 문자열)
                resolve([]);
              } else {
                const cacheData = JSON.stringify({
                  timestamp: Date.now(),
                  data: jsonResponse,
                });

                // LocalStorage + GM 저장소에 저장
                localStorage.setItem(cacheKey, cacheData);
                await GM_setValue(cacheKey, cacheData);

                resolve(jsonResponse);
              }
            } else if (response.status === 401) {
              customLog.error(url, "Unauthorized: 401 error - possibly invalid credentials");
              resolve([]);
            } else {
              customLog.error(url, `Error: ${response.status}`);
              resolve([]);
            }
          } catch (error) {
            customLog.error(url, "Parsing error: ", error);
            resolve([]);
          }
        },
        onerror: (error) => {
          if (timeoutId) clearTimeout(timeoutId);
          customLog.error(url, "Request error: " + error.message);
          resolve([]);
        },
      });
    });
  };
  const getBroadM3u8Domain = async (broadNumber) => {
    const baseUrl = "https://livestream-manager.sooplive.co.kr/broad_stream_assign.html";
    const params = new URLSearchParams({
      return_type: "gs_cdn_pc_web",
      use_cors: "true",
      cors_origin_url: "play.sooplive.co.kr",
      broad_key: `${broadNumber}-common-master-hls`,
      player_mode: "landing",
      time: "0",
    });

    const requestUrl = `${baseUrl}?${params.toString()}`;

    try {
      const res = await fetch(requestUrl, {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();

      if (data.result === "1" && data.view_url) {
        customLog.log("M3U8 URL:", data.view_url);
        return data.view_url;
      } else {
        customLog.log("Failed to retrieve M3U8 URL:", data);
        return null;
      }
    } catch (error) {
      customLog.error("Error fetching M3U8 URL:", error);
      return null;
    }
  };

  const getBroadAid2 = async (id, broadNumber, quality = "original") => {
    const basePayload = {
      bid: id,
      bno: broadNumber,
      from_api: "0",
      mode: "landing",
      player_type: "html5",
      stream_type: "common",
      quality: quality,
    };

    // AID 요청 함수
    const requestAid = async (password = "") => {
      const payload = {
        ...basePayload,
        type: "aid",
        pwd: password,
      };
      const options = {
        method: "POST",
        body: new URLSearchParams(payload),
        credentials: "include",
        cache: "no-store",
      };
      const res = await fetch("https://live.sooplive.co.kr/afreeca/player_live_api.php", options);
      return await res.json();
    };

    // LIVE 요청 함수
    const requestLive = async () => {
      const payload = {
        ...basePayload,
        type: "live",
        pwd: "",
      };
      const options = {
        method: "POST",
        body: new URLSearchParams(payload),
        credentials: "include",
        cache: "no-store",
      };
      const res = await fetch("https://live.sooplive.co.kr/afreeca/player_live_api.php", options);
      return await res.json();
    };

    try {
      // 1차: 비밀번호 없이 AID 요청
      const result1 = await requestAid("");
      if (result1?.CHANNEL?.AID) {
        customLog.log(result1.CHANNEL.AID);
        return result1.CHANNEL.AID;
      }

      // 2차: LIVE 요청으로 BPWD 확인
      const result2 = await requestLive();
      if (result2?.CHANNEL?.BPWD === "Y") {
        const password = prompt("비밀번호를 입력하세요:");
        if (password === null) return null;

        // 3차: 입력된 비밀번호로 다시 AID 요청
        const retryResult = await requestAid(password);
        if (retryResult?.CHANNEL?.AID) {
          customLog.log(result1.CHANNEL.AID);
          return retryResult.CHANNEL.AID;
        } else {
          alert("비밀번호가 틀렸거나 종료된 방송입니다.");
        }
      }

      return null;
    } catch (error) {
      customLog.log("오류 발생:", error);
      return null;
    }
  };

  const getM3u8url = async (id, broadNumber, quality = "hd") => {
    try {
      // Use Promise.all to initiate both requests concurrently
      const [aid, baseUrl] = await Promise.all([getBroadAid2(id, broadNumber, quality), getBroadM3u8Domain(broadNumber)]);

      if (!aid) {
        customLog.log("Failed to get AID. Cannot construct complete URL.");
        return null;
      }

      if (!baseUrl) {
        customLog.log("Failed to get base M3u8 URL. Cannot construct complete URL.");
        return null;
      }

      // Construct the complete URL by appending the AID
      const completeUrl = `${baseUrl}?aid=${aid}`;
      customLog.log("Complete Broad URL:", completeUrl);
      return completeUrl;
    } catch (error) {
      customLog.error("Error in getM3u8url:", error);
      return null;
    }
  };

  const getLatestFrameData = async (id, broadNumber) => {
    const videoElement = document.createElement("video");
    videoElement.playbackRate = 16; // 빠른 재생 속도 설정

    const m3u8url = await getM3u8url(id, broadNumber, "sd");

    if (unsafeWindow.Hls.isSupported()) {
      const hls = new unsafeWindow.Hls();
      hls.loadSource(m3u8url);
      hls.attachMedia(videoElement);

      return new Promise((resolve) => {
        videoElement.addEventListener("canplay", async () => {
          const frameData = await captureLatestFrame(videoElement);
          resolve(frameData);
          videoElement.pause();
          videoElement.src = "";
        });
      });
    } else {
      customLog.error("HLS.js를 지원하지 않는 브라우저입니다.");
      return null;
    }
  };

  // 3.2. 핵심 유틸리티 함수 (Core Utility Functions)

  /**
   * URL 변경 시마다 재초기화
   * @param {Function} initFn
   * @param {number} delayMs
   */
  const observeWithReinit = (initFn, delayMs = 2000) => {
    initFn();
    observeUrlChanges(() => {
      setTimeout(initFn, delayMs);
    });
  };

  /**
   * 즐겨찾기 목록에서 우선순위에 따라 정렬된 '라이브 방송 목록 전체'를 반환하는 함수
   * @param {object} favoriteData - fetch로 받아온 즐겨찾기 데이터
   * @returns {object[]} - 우선순위에 따라 정렬된 방송 정보 객체 배열
   */
  function getPrioritizedLiveBroadcasts(favoriteData) {
    if (!favoriteData?.data?.length) {
      return []; // 비어있는 배열 반환
    }

    const liveCategories = {
      pinnedOnline: [],
      notifiedOnline: [],
      normalOnline: [],
    };

    favoriteData.data.forEach((item) => {
      if (item.is_live !== true) return;

      const isPin = item.is_pin === true;
      const isMobilePush = item.is_mobile_push === "Y";
      const broadInfo = item.broad_info?.[0];

      if (!broadInfo) return;

      if (isPin) liveCategories.pinnedOnline.push(broadInfo);
      else if (isMobilePush) liveCategories.notifiedOnline.push(broadInfo);
      else liveCategories.normalOnline.push(broadInfo);
    });

    const compareWatchers = (a, b) => (b.total_view_cnt || 0) - (a.total_view_cnt || 0);
    Object.values(liveCategories).forEach((category) => {
      category.sort(compareWatchers);
    });

    // 우선순위에 따라 카테고리를 합쳐서 최종 목록을 만듭니다.
    const prioritizedList = [...liveCategories.pinnedOnline, ...liveCategories.notifiedOnline, ...liveCategories.normalOnline];

    return prioritizedList;
  }

  function getFollowList(callback) {
    GM_xmlhttpRequest({
      method: "GET",
      url: "https://myapi.sooplive.co.kr/api/favorite",
      headers: {
        "Content-Type": "application/json",
      },
      onload: function (response) {
        try {
          const res = JSON.parse(response.responseText);
          if (res.code === -10000) {
            callback([]);
          } else {
            // user_id만 추출
            const userIdList = res.data.map((item) => item.user_id);
            // 저장
            GM_setValue("allFollowUserIds", userIdList);
            // 콜백 전달
            callback(userIdList);
          }
        } catch (e) {
          customLog.error("Parsing error:", e);
          callback([]);
        }
      },
      onerror: function (error) {
        customLog.error("Request error:", error);
        callback([]);
      },
    });
  }

  function waitForVariable(varName, timeout = 20000) {
    return new Promise((resolve, reject) => {
      let e = 0;
      const t = setInterval(() => {
        unsafeWindow[varName] ? (clearInterval(t), resolve(unsafeWindow[varName])) : ((e += 200), e >= timeout && (clearInterval(t), reject(new Error(`'${varName}' 변수를 찾지 못했습니다.`))));
      }, 200);
    });
  }
  const loadHlsScript = () => {
    // hls.js 동적 로드
    const hlsScript = document.createElement("script");
    hlsScript.src = "https://cdn.jsdelivr.net/npm/hls.js@latest";
    hlsScript.onload = function () {
      customLog.log("hls.js가 성공적으로 로드되었습니다.");
    };
    hlsScript.onerror = function () {
      customLog.error("hls.js 로드 중 오류가 발생했습니다.");
    };
    document.head.appendChild(hlsScript);
  };
  const applyFontStyles = () => {
    const style = document.createElement("style");
    style.textContent = `
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
            * {
                font-family: 'Inter' !important;
            }
        `;
    document.head.appendChild(style);
  };
  const checkIfTimeover = (timestamp) => {
    const now = Date.now();
    const inputTime = timestamp * 1000; // 초 단위 타임스탬프를 밀리초로 변환

    // 24시간(1일) = 86400000 밀리초
    return now - inputTime > 86400000;
  };
  const timeSince = (serverTimeStr) => {
    // 입력 문자열 → ISO 8601 + KST 오프셋으로 변환
    const toKSTDate = (str) => {
      const iso = str.replace(" ", "T") + "+09:00";
      return new Date(iso);
    };

    const postTime = toKSTDate(serverTimeStr).getTime(); // 게시물 작성 시각 (KST)
    const now = Date.now(); // 현재 시각 (밀리초 기준, UTC)

    const seconds = Math.floor((now - postTime) / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 365) return `${Math.floor(days / 365)}년 전`;
    if (days > 30) return `${Math.floor(days / 30)}개월 전`;
    if (days > 0) return `${days}일 전`;
    if (hours > 0) return `${hours}시간 전`;
    if (minutes > 0) return `${minutes}분 전`;

    return `${seconds}초 전`;
  };
  const waitForElement = (selector, callback, timeout = 10000) => {
    let observer = null;

    const timeoutId = setTimeout(() => {
      if (observer) {
        observer.disconnect();
        customLog.warn(`[waitForElement] Timeout: '${selector}' 요소를 ${timeout}ms 내에 찾지 못했습니다.`);
      }
    }, timeout);

    const element = document.querySelector(selector);
    if (element) {
      clearTimeout(timeoutId);
      callback(selector, element);
      return;
    }

    observer = new MutationObserver((mutations, obs) => {
      const targetElement = document.querySelector(selector);
      if (targetElement) {
        obs.disconnect();
        clearTimeout(timeoutId);
        callback(selector, targetElement);
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  };
  const waitForElementAsync = (selector, timeout = 10000) => {
    return new Promise((resolve, reject) => {
      // 1. 요소가 이미 존재하는지 즉시 확인
      const element = document.querySelector(selector);
      if (element) {
        resolve(element);
        return;
      }

      let observer = null;

      // 2. 타임아웃 설정: 지정된 시간이 지나면 reject 실행
      const timeoutId = setTimeout(() => {
        if (observer) {
          observer.disconnect();
          // new Error 객체를 사용해 더 명확한 에러 스택 추적 가능
          //reject(new Error(`Timeout: '${selector}' 요소를 ${timeout}ms 내에 찾지 못했습니다.`));
        }
      }, timeout);

      // 3. MutationObserver 설정: DOM 변경 감지
      observer = new MutationObserver((mutations) => {
        // 변경이 감지되면 요소를 다시 찾아봄
        const targetElement = document.querySelector(selector);
        if (targetElement) {
          observer.disconnect(); // 관찰 중단
          clearTimeout(timeoutId); // 타임아웃 타이머 제거
          resolve(targetElement); // Promise 성공 처리
        }
      });

      // 4. 관찰 시작
      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });
    });
  };
  const waitForLivePlayer = (timeout = 10000) => {
    return new Promise((resolve, reject) => {
      const interval = 1500;
      let elapsed = 0;

      const check = () => {
        if (unsafeWindow.livePlayer) {
          resolve(unsafeWindow.livePlayer);
        } else {
          elapsed += interval;
          if (elapsed >= timeout) {
            reject(new Error("livePlayer 객체를 찾지 못했습니다."));
          } else {
            setTimeout(check, interval);
          }
        }
      };

      check();
    });
  };
  const waitForNonEmptyArray = async () => {
    const timeout = new Promise(
      (resolve) => setTimeout(() => resolve([]), 3000), // 3초 후 빈 배열 반환
    );

    const checkArray = (async () => {
      while (allFollowUserIds.length === 0) {
        await new Promise((resolve) => setTimeout(resolve, 100)); // 100ms 대기
      }
      return allFollowUserIds;
    })();

    return Promise.race([timeout, checkArray]);
  };
  const manageRedDot = (targetDiv) => {
    const RED_DOT_CLASS = "red-dot";
    const style = document.createElement("style");
    style.textContent = `
        .${RED_DOT_CLASS} {
            position: absolute;
            top: 8px;
            right: 8px;
            width: 4px;
            height: 4px;
            background-color: red;
            border-radius: 50%;
        }
        `;
    document.head.appendChild(style);

    const lastUpdateDate = GM_getValue("lastUpdateDate", 0);
    const btn = targetDiv;

    // 빨간 점 추가 함수
    const showRedDot = () => {
      if (!btn || document.querySelector(`#openModalBtn .${RED_DOT_CLASS}`)) return;
      const redDot = document.createElement("div");
      redDot.classList.add(RED_DOT_CLASS);
      btn.parentElement.appendChild(redDot);
    };

    // 빨간 점 제거 함수
    const hideRedDot = () => {
      const redDot = document.querySelector(`#openModalBtn .${RED_DOT_CLASS}`);
      if (redDot) redDot.remove();
    };

    // 날짜를 비교하여 빨간 점 표시
    if (NEW_UPDATE_DATE > lastUpdateDate) {
      showRedDot();
    } else {
      hideRedDot();
    }

    // 버튼 클릭 시 이벤트 핸들러 추가
    btn?.addEventListener("click", () => {
      GM_setValue("lastUpdateDate", NEW_UPDATE_DATE);
      hideRedDot();
    });
  };
  const addNumberSeparator = (number) => {
    number = Number(number);

    // 숫자가 10,000 이상일 때
    if (number >= 10000) {
      const displayNumber = (number / 10000).toFixed(1);
      return displayNumber.endsWith(".0") ? displayNumber.slice(0, -2) + "만" : displayNumber + "만";
    }

    return number.toLocaleString();
  };
  const addNumberSeparatorAll = (number) => {
    number = Number(number);

    // 숫자가 10,000 이상일 때
    if (number >= 10000) {
      const displayNumber = (number / 10000).toFixed(1);
      return displayNumber.endsWith(".0") ? displayNumber.slice(0, -2) + "만" : displayNumber + "만";
    }
    // 숫자가 1,000 이상일 때
    else if (number >= 1000) {
      const displayNumber = (number / 1000).toFixed(1);
      return displayNumber.endsWith(".0") ? displayNumber.slice(0, -2) + "천" : displayNumber + "천";
    }

    // 기본적으로 쉼표 추가
    return number.toLocaleString();
  };
  const getCategoryName = (targetCateNo) => {
    const searchCategory = (categories) => {
      for (const category of categories) {
        if (category.cate_no === targetCateNo) {
          return category.cate_name;
        }

        if (category.child?.length) {
          const result = searchCategory(category.child);
          if (result) return result;
        }
      }
    };

    return searchCategory(savedCategory.CHANNEL.BROAD_CATEGORY);
  };
  const getCategoryNo = (targetCateName) => {
    const searchCategory = (categories) => {
      for (const category of categories) {
        if (category.cate_name === targetCateName) {
          return category.cate_no;
        }

        if (category.child?.length) {
          const result = searchCategory(category.child);
          if (result) return result;
        }
      }
    };

    return searchCategory(savedCategory.CHANNEL.BROAD_CATEGORY);
  };
  const compareWatchers = (a, b) => {
    // Get watchers data only once for each element
    const watchersA = a.dataset.watchers ? +a.dataset.watchers : 0; // Use dataset for better performance
    const watchersB = b.dataset.watchers ? +b.dataset.watchers : 0; // Use dataset for better performance
    return watchersB - watchersA; // Sort by watchers
  };
  const stableRandomOrder = (() => {
    // 한 번에 여러 개를 정렬할 때 일관된 랜덤성을 유지하려면, 미리 섞어주는 방식이 좋습니다.
    // 이 함수는 내부적으로 shuffle된 index 맵을 사용해서 안정적인 무작위 정렬을 구현합니다.

    let randomMap = new WeakMap();

    return (a, b) => {
      if (!randomMap.has(a)) randomMap.set(a, Math.random());
      if (!randomMap.has(b)) randomMap.set(b, Math.random());
      return randomMap.get(a) - randomMap.get(b);
    };
  })();
  const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };
  const isElementVisible = (selector) => {
    const el = document.querySelector(selector);
    if (!el) return false; // 요소가 없음

    const style = window.getComputedStyle(el);
    if (style.display === "none" || style.visibility === "hidden" || style.opacity === "0") {
      return false; // CSS로 숨겨진 경우
    }

    const rect = el.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) {
      return false; // 크기가 0인 경우
    }

    // 화면 안에 일부라도 보이는 경우
    return rect.bottom > 0 && rect.right > 0 && rect.top < (window.innerHeight || document.documentElement.clientHeight) && rect.left < (window.innerWidth || document.documentElement.clientWidth);
  };
  const updateBodyClass = (targetClass) => {
    if (!window.matchMedia("(orientation: portrait)").matches) {
      document.body.classList.remove(targetClass);
      document.querySelector(".expand-toggle-li").style.display = "none";
    } else {
      document.querySelector(".expand-toggle-li").style.display = "block";
    }
  };
  const extractDateTime = (text) => {
    const [dateStr, timeStr] = text.split(" "); // split 한 번으로 날짜와 시간을 동시에 얻기
    const dateTimeStr = `${dateStr}T${timeStr}Z`; // 문자열 템플릿 사용
    return new Date(dateTimeStr);
  };
  const getElapsedTime = (broadcastStartTimeText, type) => {
    const broadcastStartTime = extractDateTime(broadcastStartTimeText);
    broadcastStartTime.setHours(broadcastStartTime.getHours() - 9);
    const currentTime = new Date();
    const timeDiff = currentTime - broadcastStartTime;

    const secondsElapsed = Math.floor(timeDiff / 1000);
    const hoursElapsed = Math.floor(secondsElapsed / 3600);
    const minutesElapsed = Math.floor((secondsElapsed % 3600) / 60);
    const remainingSeconds = secondsElapsed % 60;
    let formattedTime = "";

    if (type === "HH:MM:SS") {
      formattedTime = `${String(hoursElapsed).padStart(2, "0")}:${String(minutesElapsed).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
    } else if (type === "HH:MM") {
      if (hoursElapsed > 0) {
        formattedTime = `${String(hoursElapsed)}시간 `;
      }
      formattedTime += `${String(minutesElapsed)}분`;
    }
    return formattedTime;
  };
  const isUserTyping = () => {
    const active = document.activeElement;
    const tag = active?.tagName?.toUpperCase();
    return tag === "INPUT" || tag === "TEXTAREA" || active?.isContentEditable || active?.id === "write_area";
  };
  const observeElementChanges = (targetSelector, callback, options = {}) => {
    /**
     * 지정된 요소의 DOM 변경을 감지하고, 변경 시 콜백 함수를 실행하는 범용 유틸리티 함수입니다.
     *
     * @param {string} targetSelector - 감시할 요소의 CSS 선택자입니다.
     * @param {function(MutationRecord[], MutationObserver): void} callback - DOM 변경이 감지되었을 때 실행할 콜백 함수입니다.
     * @param {Object} [options] - 관찰에 대한 설정 객체입니다. (선택 사항)
     * @param {boolean} [options.once=false] - true로 설정하면 콜백을 한 번만 실행하고 관찰을 자동 중단합니다.
     * @param {MutationObserverInit} [options] - MutationObserver의 표준 설정도 포함합니다. (childList, subtree, attributes 등)
     * @returns {MutationObserver|null} 생성된 MutationObserver 인스턴스를 반환합니다.
     */
    // 1. 감시할 대상 요소 선택
    const targetElement = document.querySelector(targetSelector);
    if (!targetElement) {
      customLog.error(`[observeElementChanges] 오류: 선택자 '${targetSelector}'에 해당하는 요소를 찾을 수 없습니다.`);
      return null;
    }

    // 2. 콜백 함수 유효성 검사
    if (typeof callback !== "function") {
      customLog.error(`[observeElementChanges] 오류: 두 번째 인자로 전달된 콜백이 함수가 아닙니다.`);
      return null;
    }

    // 3. 옵션 분리 및 설정
    // options 객체에서 'once' 속성을 분리하고, 나머지는 observer 설정으로 사용합니다.
    const { once = false, ...observerOptions } = options;

    const defaultConfig = {
      childList: true, // 기본값: 자식 요소 변경 감지
      subtree: true, // 기본값: 하위 트리까지 감지
    };
    // 기본 설정, 사용자 지정 observer 설정을 병합
    const config = { ...defaultConfig, ...observerOptions };

    // 4. MutationObserver 인스턴스 생성 및 콜백 연결
    const observer = new MutationObserver((mutationsList, observer) => {
      // 사용자 콜백 실행
      callback(mutationsList, observer);

      // 5. 'once' 옵션이 true이면, 콜백 실행 후 즉시 관찰 중단
      if (once) {
        observer.disconnect();
        customLog.log(`[observeElementChanges] '${targetSelector}' 요소에 대한 관찰이 1회 실행 후 중단되었습니다.`);
      }
    });

    // 6. 관찰 시작
    observer.observe(targetElement, config);
    customLog.log(`[observeElementChanges] '${targetSelector}' 요소에 대한 관찰을 시작합니다. (once: ${once})`);

    // 7. 생성된 observer 인스턴스 반환
    return observer;
  };
  const observeUrlChanges = (() => {
    let lastUrl = window.location.pathname;
    const callbacks = new Set();
    let isObserving = false;

    const triggerCallbacks = (newUrl) => {
      if (newUrl !== lastUrl) {
        lastUrl = newUrl;
        callbacks.forEach((cb) => cb(newUrl));
      }
    };

    const startObserving = () => {
      if (isObserving) return;
      isObserving = true;

      window.addEventListener("popstate", () => {
        triggerCallbacks(window.location.pathname);
      });

      const originalPushState = history.pushState;
      const originalReplaceState = history.replaceState;

      history.pushState = function (...args) {
        originalPushState.apply(this, args);
        triggerCallbacks(args[2]?.toString() || window.location.pathname);
      };

      history.replaceState = function (...args) {
        originalReplaceState.apply(this, args);
        triggerCallbacks(args[2]?.toString() || window.location.pathname);
      };
    };

    return function registerCallback(callback) {
      startObserving();
      callbacks.add(callback);

      // 개별 콜백 제거 가능
      return function disconnect() {
        callbacks.delete(callback);
      };
    };
  })();
  const waitForConditionAsync = (conditionFn, timeout = 10000) => {
    /**
     * 주어진 조건 함수(conditionFn)가 true를 반환할 때까지 기다리는 Promise를 반환합니다.
     * @param {() => boolean} conditionFn - true 또는 false를 반환하는 조건 함수.
     * @param {number} [timeout=10000] - 기다릴 최대 시간 (밀리초).
     * @returns {Promise<void>} 조건이 충족되면 resolve되는 Promise.
     */
    return new Promise((resolve, reject) => {
      // 1. 즉시 조건 확인
      if (conditionFn()) {
        resolve();
        return;
      }

      let observer = null;

      // 2. 타임아웃 설정
      const timeoutId = setTimeout(() => {
        if (observer) {
          observer.disconnect();
          reject(new Error("Timeout: 조건이 지정된 시간 내에 충족되지 않았습니다."));
        }
      }, timeout);

      // 3. MutationObserver로 body의 모든 변화를 감지
      observer = new MutationObserver(() => {
        if (conditionFn()) {
          observer.disconnect();
          clearTimeout(timeoutId);
          resolve();
        }
      });

      observer.observe(document.body, { childList: true, subtree: true, attributes: true });
    });
  };
  const observeClassChanges = (targetSelector, callback) => {
    /**
     * 지정된 요소의 'class' 속성 변경만을 감지하고, 변경 시 콜백 함수를 실행하는 유틸리티 함수입니다.
     * 이 함수는 MutationObserver를 사용하여 불필요한 DOM 변경 감지를 최소화합니다.
     *
     * @param {string} targetSelector - 감시할 요소의 CSS 선택자입니다.
     * @param {function(MutationRecord[], MutationObserver): void} callback - 'class' 속성 변경이 감지되었을 때 실행할 콜백 함수입니다.
     * @returns {MutationObserver|null} 생성된 MutationObserver 인스턴스를 반환합니다.
     */

    // 1. 감시할 대상 요소 선택
    const targetElement = document.querySelector(targetSelector);
    if (!targetElement) {
      customLog.error(`[observeClassChanges] 오류: 선택자 '${targetSelector}'에 해당하는 요소를 찾을 수 없습니다.`);
      return null;
    }

    // 2. 콜백 함수 유효성 검사
    if (typeof callback !== "function") {
      customLog.error(`[observeClassChanges] 오류: 두 번째 인자로 전달된 콜백이 함수가 아닙니다.`);
      return null;
    }

    // 3. MutationObserver 설정 (class 변화에만 집중)
    const config = {
      attributes: true, // 속성 변경 감지 활성화
      attributeFilter: ["class"], // 'class' 속성만 필터링하여 감지
      childList: false, // 자식 요소 변경 감지 비활성화 (기본값 재정의)
      subtree: false, // 하위 트리 변경 감지 비활성화 (기본값 재정의)
    };

    // 4. MutationObserver 인스턴스 생성 및 콜백 연결
    const observer = new MutationObserver((mutationsList, observerInstance) => {
      // 'class' 속성 변경에 대한 모든 변경 레코드를 순회하며 콜백 실행
      // 실제 콜백 함수는 모든 mutationList를 받을 수 있지만,
      // 이 옵션으로 인해 class attribute 변경만 여기에 전달됩니다.
      callback(mutationsList, observerInstance);
    });

    // 5. 관찰 시작
    observer.observe(targetElement, config);
    customLog.log(`[observeClassChanges] '${targetSelector}' 요소의 클래스 변경 감시를 시작합니다.`);

    // 6. 생성된 observer 인스턴스 반환 (필요시 중단 등을 위해)
    return observer;
  };
  const loadScript = (url) => {
    return new Promise((resolve, reject) => {
      // 동일한 스크립트가 이미 로드되었는지 확인
      if (document.querySelector(`script[src="${url}"]`)) {
        customLog.log(`스크립트가 이미 로드됨: ${url}`);
        resolve();
        return;
      }

      const script = document.createElement("script");
      script.src = url;
      script.onload = () => {
        customLog.log(`스크립트 로드 성공: ${url}`);
        resolve();
      };
      script.onerror = () => {
        customLog.error(`스크립트 로드 실패: ${url}`);
        reject(new Error(`${url} 로드 실패`));
      };
      document.head.appendChild(script);
    });
  };

  // 3.3. 차단 기능 관련 함수 (Blocking Features)

  function savePinnedCategories() {
    GM_setValue("pinnedCategories", pinnedCategories);
  }

  function pinCategory(categoryName, categoryId) {
    if (!pinnedCategories.some((cat) => cat.categoryId === categoryId)) {
      pinnedCategories.push({ categoryName, categoryId });
      savePinnedCategories();
      alert(`카테고리 '${categoryName}'을(를) 탭에 추가했습니다.\n해제는 Tampermonkey 메뉴에서 가능합니다.`);
      registerCategoryUnpinMenu({ categoryName, categoryId });
    } else {
      alert(`'${categoryName}' 카테고리는 이미 추가되어 있습니다.`);
    }
  }

  function unpinCategory(categoryId) {
    const categoryToRemove = pinnedCategories.find((cat) => cat.categoryId === categoryId);
    if (categoryToRemove) {
      pinnedCategories = pinnedCategories.filter((cat) => cat.categoryId !== categoryId);
      savePinnedCategories();
      alert(`'${categoryToRemove.categoryName}' 카테고리 고정을 해제했습니다.`);
      unregisterCategoryUnpinMenu(categoryToRemove.categoryId);
      if (selectedPinnedCategoryIdx === categoryId) {
        selectedPinnedCategoryIdx = "all";
        GM_setValue("selectedPinnedCategoryIdx", "all");
      }
    }
  }

  function registerCategoryUnpinMenu(category) {
    if (!category || !category.categoryName) return;
    let menuId = GM_registerMenuCommand(`📌 탭 해제 - ${category.categoryName}`, () => {
      unpinCategory(category.categoryId);
    });
    categoryMenuIds[category.categoryId] = menuId;
  }

  function unregisterCategoryUnpinMenu(categoryId) {
    let menuId = categoryMenuIds[categoryId];
    if (menuId) {
      GM_unregisterMenuCommand(menuId);
      delete categoryMenuIds[categoryId];
    }
  }

  function saveBlockedUsers() {
    GM_setValue("blockedUsers", blockedUsers);
  }
  function blockUser(userName, userId) {
    // 이미 차단된 사용자인지 확인
    if (!isUserBlocked(userId)) {
      blockedUsers.push({ userName, userId });
      saveBlockedUsers();
      alert(`사용자 ${userName}(${userId})를 차단했습니다.\n차단 해제 메뉴는 템퍼몽키 아이콘을 누르면 있습니다.`);
      registerUnblockMenu({ userName, userId });
    } else {
      alert(`사용자 ${userName}(${userId})는 이미 차단되어 있습니다.`);
    }
  }
  function unblockUser(userId) {
    // 차단된 사용자 목록에서 해당 사용자 찾기
    let unblockedUser = blockedUsers.find((user) => user.userId === userId);

    // 사용자를 찾았을 때만 차단 해제 및 메뉴 삭제 수행
    if (unblockedUser) {
      // 차단된 사용자 목록에서 해당 사용자 제거
      blockedUsers = blockedUsers.filter((user) => user.userId !== userId);

      // 변경된 목록을 저장
      GM_setValue("blockedUsers", blockedUsers);

      alert(`사용자 ${userId}의 차단이 해제되었습니다.`);

      unregisterUnblockMenu(unblockedUser.userName);
    }
  }
  function isUserBlocked(userId) {
    return blockedUsers.some((user) => user.userId === userId);
  }
  function registerUnblockMenu(user) {
    // GM_registerMenuCommand로 메뉴를 등록하고 메뉴 ID를 기록
    let menuId = GM_registerMenuCommand(`💔 차단 해제 - ${user.userName}`, function () {
      unblockUser(user.userId);
    });

    // 메뉴 ID를 기록
    menuIds[user.userName] = menuId;
  }
  function unregisterUnblockMenu(userName) {
    // userName을 기반으로 저장된 메뉴 ID를 가져와서 삭제
    let menuId = menuIds[userName];
    if (menuId) {
      GM_unregisterMenuCommand(menuId);
      delete menuIds[userName]; // 삭제된 메뉴 ID를 객체에서도 제거
    }
  }
  function saveBlockedCategories() {
    GM_setValue("blockedCategories", blockedCategories);
  }
  function blockCategory(categoryName, categoryId) {
    // 이미 차단된 카테고리인지 확인
    if (!isCategoryBlocked(categoryId)) {
      blockedCategories.push({ categoryName, categoryId });
      saveBlockedCategories();
      alert(`카테고리 ${categoryName}(${categoryId})를 차단했습니다.\n차단 해제 메뉴는 템퍼몽키 아이콘을 누르면 있습니다.`);
      registerCategoryUnblockMenu({ categoryName, categoryId });
    } else {
      alert(`카테고리 ${categoryName}(${categoryId})는 이미 차단되어 있습니다.`);
    }
  }
  function unblockCategory(categoryId) {
    // 차단된 카테고리 목록에서 해당 카테고리 찾기
    let unblockedCategory = blockedCategories.find((category) => category.categoryId === categoryId);

    // 카테고리를 찾았을 때만 차단 해제 및 메뉴 삭제 수행
    if (unblockedCategory) {
      // 차단된 카테고리 목록에서 해당 카테고리 제거
      blockedCategories = blockedCategories.filter((category) => category.categoryId !== categoryId);

      // 변경된 목록을 저장
      GM_setValue("blockedCategories", blockedCategories);

      alert(`카테고리 ${categoryId}의 차단이 해제되었습니다.`);

      unregisterCategoryUnblockMenu(unblockedCategory.categoryName);
    }
  }
  function isCategoryBlocked(categoryId) {
    return blockedCategories.some((category) => category.categoryId === categoryId);
  }
  function registerCategoryUnblockMenu(category) {
    // GM_registerMenuCommand로 카테고리 메뉴를 등록하고 메뉴 ID를 기록
    let menuId = GM_registerMenuCommand(`💔 카테고리 차단 해제 - ${category.categoryName}`, function () {
      unblockCategory(category.categoryId);
    });

    // 메뉴 ID를 기록
    categoryMenuIds[category.categoryName] = menuId;
  }
  function unregisterCategoryUnblockMenu(categoryName) {
    // categoryName을 기반으로 저장된 메뉴 ID를 가져와서 삭제
    let menuId = categoryMenuIds[categoryName];
    if (menuId) {
      GM_unregisterMenuCommand(menuId);
      delete categoryMenuIds[categoryName]; // 삭제된 메뉴 ID를 객체에서도 제거
    }
  }
  function saveBlockedWords() {
    GM_setValue("blockedWords", blockedWords);
  }
  function blockWord(word) {
    // 단어의 양쪽 공백 제거
    word = word.trim();

    // 단어가 두 글자 이상인지 확인
    if (word.length < 2) {
      alert("단어는 두 글자 이상이어야 합니다.");
      return;
    }

    // 이미 차단된 단어인지 확인
    if (!isWordBlocked(word)) {
      blockedWords.push(word);
      saveBlockedWords();
      alert(`단어 "${word}"를 차단했습니다.`);
      registerWordUnblockMenu(word);
    } else {
      alert(`단어 "${word}"는 이미 차단되어 있습니다.`);
    }
  }
  function unblockWord(word) {
    // 차단된 단어 목록에서 해당 단어 찾기
    let unblockedWord = blockedWords.find((blockedWord) => blockedWord === word);

    // 단어를 찾았을 때만 차단 해제 및 메뉴 삭제 수행
    if (unblockedWord) {
      // 차단된 단어 목록에서 해당 단어 제거
      blockedWords = blockedWords.filter((blockedWord) => blockedWord !== word);

      // 변경된 목록을 저장
      saveBlockedWords();

      alert(`단어 "${word}"의 차단이 해제되었습니다.`);
      unregisterWordUnblockMenu(word);
    }
  }
  function isWordBlocked(word) {
    const lowerCaseWord = word.toLowerCase();
    return blockedWords.map((word) => word.toLowerCase()).includes(lowerCaseWord);
  }
  function registerWordUnblockMenu(word) {
    // GM_registerMenuCommand로 단어 차단 해제 메뉴를 등록하고 메뉴 ID를 기록
    let menuId = GM_registerMenuCommand(`💔 단어 차단 해제 - ${word}`, function () {
      unblockWord(word);
    });

    // 메뉴 ID를 기록
    wordMenuIds[word] = menuId;
  }
  function unregisterWordUnblockMenu(word) {
    // word를 기반으로 저장된 메뉴 ID를 가져와서 삭제
    let menuId = wordMenuIds[word];
    if (menuId) {
      GM_unregisterMenuCommand(menuId);
      delete wordMenuIds[word]; // 삭제된 메뉴 ID를 객체에서도 제거
    }
  }
  function registerMenuBlockingWord() {
    // GM 메뉴에 단어 차단 등록 메뉴를 추가합니다.
    GM_registerMenuCommand("단어 등록 | 방제와 태그(카테고리 제외)에 포함시 차단", function () {
      // 사용자에게 차단할 단어 입력을 요청
      let word = prompt("차단할 단어 (2자 이상): ");

      // 입력한 단어가 있을 때만 처리
      if (word) {
        blockWord(word);
      }
    });
  }
  // 카테고리 차단 메뉴 추가
  function registerMenuBlockingCategory() {
    // GM 메뉴에 카테고리 차단 등록 메뉴를 추가합니다.
    GM_registerMenuCommand("카테고리 등록 | 카테고리에 포함시 차단", function () {
      // 사용자에게 차단할 단어 입력을 요청
      let word = prompt("차단할 카테고리 : ");

      if (word.length < 1) {
        alert("카테고리는 한 글자 이상이어야 합니다.");
        return;
      }

      let catnum = getCategoryNo(word);
      if (catnum === undefined) {
        alert(`${word}(은)는 유효하지 않은 카테고리 입니다.`);
        return;
      }

      blockCategory(word, catnum);
    });
  }

  // =================================================================
  // 3.4. UI 생성 및 조작 함수 (UI Generation & Manipulation) - 개선안
  // =================================================================

  // [수정] 그룹 이름 옆의 숫자 카운트를 제거한 최종 버전
  const createFavoriteGroupTabs = async (sectionParent) => {
    if (!isFavoriteGroupEnabled) return;

    const existingWrapper = document.getElementById("favorite-group-wrapper");
    if (existingWrapper) existingWrapper.remove();

    const groups = await fetchFavoriteGroups();
    if (groups.length === 0) return;

    const wrapper = document.createElement("div");
    wrapper.id = "favorite-group-wrapper";

    const tabContainer = document.createElement("div");
    tabContainer.id = "favorite-group-tabs";

    const createTab = (title, idx) => {
      const tab = document.createElement("div");
      tab.className = "fav-group-tab";

      // 옵션이 켜져 있고 '전체' 탭이 아닐 경우, 이름을 한 글자로 축약
      if (isShortenFavoriteGroupNameEnabled && idx !== "all") {
        tab.textContent = title.substring(0, 1);
      } else {
        tab.textContent = title;
      }
      // 마우스를 올렸을 때 전체 이름이 보이도록 title 속성 추가
      tab.title = title;

      tab.dataset.idx = idx;

      if (idx == selectedFavoriteGroupIdx) {
        tab.classList.add("active");
      }

      tab.addEventListener("click", async (e) => {
        const newIdx = e.currentTarget.dataset.idx;
        if (newIdx == selectedFavoriteGroupIdx) return;

        selectedFavoriteGroupIdx = newIdx;
        GM_setValue("selectedFavoriteGroupIdx", newIdx);

        tabContainer.querySelectorAll(".fav-group-tab").forEach((t) => t.classList.remove("active"));
        e.currentTarget.classList.add("active");

        const followSectionConfig = allSections.find((s) => s.id === "follow");
        if (followSectionConfig) {
          await createAndPopulateSection(followSectionConfig, true);
        }
      });
      return tab;
    };

    tabContainer.appendChild(createTab("전체", "all"));
    groups.forEach((group) => {
      tabContainer.appendChild(createTab(group.title, group.idx));
    });

    const scrollLeftBtn = document.createElement("button");
    scrollLeftBtn.id = "scroll-left-btn";
    scrollLeftBtn.className = "fav-group-scroll-btn scroll-btn-left"; // 클래스 추가
    scrollLeftBtn.innerHTML = "‹";

    const scrollRightBtn = document.createElement("button");
    scrollRightBtn.id = "scroll-right-btn";
    scrollRightBtn.className = "fav-group-scroll-btn scroll-btn-right"; // 클래스 추가
    scrollRightBtn.innerHTML = "›";

    wrapper.appendChild(scrollLeftBtn);
    wrapper.appendChild(tabContainer);
    wrapper.appendChild(scrollRightBtn);

    const userSection = sectionParent.querySelector(".users-section.follow");
    if (userSection) {
      sectionParent.insertBefore(wrapper, userSection);
    }

    const updateScrollButtonsVisibility = () => {
      const isScrollable = tabContainer.scrollWidth > tabContainer.clientWidth;

      if (!isScrollable) {
        scrollLeftBtn.classList.remove("visible");
        scrollRightBtn.classList.remove("visible");
        return;
      }

      scrollLeftBtn.classList.toggle("visible", tabContainer.scrollLeft > 1);

      const isAtEnd = tabContainer.scrollWidth - tabContainer.clientWidth - tabContainer.scrollLeft < 1;
      scrollRightBtn.classList.toggle("visible", !isAtEnd);
    };

    const scrollAmount = 150;
    scrollLeftBtn.addEventListener("click", () => {
      tabContainer.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    });
    scrollRightBtn.addEventListener("click", () => {
      tabContainer.scrollBy({ left: scrollAmount, behavior: "smooth" });
    });

    const debouncedUpdate = debounce(updateScrollButtonsVisibility, 50);
    tabContainer.addEventListener("scroll", debouncedUpdate);

    new ResizeObserver(updateScrollButtonsVisibility).observe(tabContainer);

    setTimeout(updateScrollButtonsVisibility, 100);
  };

  // === 신규 '카테고리 탭' 생성 함수 ===
  const createCategoryTabs = async (sectionParent) => {
    if (!isCategoryGroupEnabled) return;
    const existingWrapper = document.getElementById("category-group-wrapper");
    if (existingWrapper) existingWrapper.remove();

    if (pinnedCategories.length === 0) return;

    const wrapper = document.createElement("div");
    wrapper.id = "category-group-wrapper";
    wrapper.style.position = "relative";
    wrapper.style.marginBottom = "5px";

    const tabContainer = document.createElement("div");
    tabContainer.id = "category-group-tabs";
    tabContainer.style.display = "flex";
    tabContainer.style.alignItems = "center";
    tabContainer.style.overflowX = "auto";
    tabContainer.style.overflowY = "hidden";
    tabContainer.style.boxSizing = "border-box";
    tabContainer.style.scrollbarWidth = "none";
    tabContainer.style.marginLeft = "5px";
    tabContainer.style.setProperty("-ms-overflow-style", "none");

    const createTab = (title, idx) => {
      const tab = document.createElement("div");
      tab.className = "fav-group-tab";

      // 옵션이 켜져 있고 '전체' 탭이 아닐 경우, 이름을 한 글자로 축약
      if (isShortenCategoryNameEnabled && idx !== "all") {
        tab.textContent = title.substring(0, 1);
      } else {
        tab.textContent = title;
      }
      // 마우스를 올렸을 때 전체 이름이 보이도록 title 속성 추가
      tab.title = title;

      tab.dataset.idx = idx;

      if (idx == selectedPinnedCategoryIdx) {
        tab.classList.add("active");
      }

      tab.addEventListener("click", async (e) => {
        const newIdx = e.currentTarget.dataset.idx;
        if (newIdx == selectedPinnedCategoryIdx) return;

        selectedPinnedCategoryIdx = newIdx;
        GM_setValue("selectedPinnedCategoryIdx", newIdx);

        tabContainer.querySelectorAll(".fav-group-tab").forEach((t) => t.classList.remove("active"));
        e.currentTarget.classList.add("active");

        const topSectionConfig = allSections.find((s) => s.id === "top");
        if (topSectionConfig) {
          await createAndPopulateSection(topSectionConfig, true);
        }
      });
      return tab;
    };

    tabContainer.appendChild(createTab("전체", "all"));
    pinnedCategories.forEach((cat) => {
      tabContainer.appendChild(createTab(cat.categoryName, cat.categoryId));
    });

    const scrollLeftBtn = document.createElement("button");
    scrollLeftBtn.id = "scroll-left-btn-cat";
    scrollLeftBtn.className = "fav-group-scroll-btn scroll-btn-left"; // 클래스 추가
    scrollLeftBtn.innerHTML = "‹";

    const scrollRightBtn = document.createElement("button");
    scrollRightBtn.id = "scroll-right-btn-cat";
    scrollRightBtn.className = "fav-group-scroll-btn scroll-btn-right"; // 클래스 추가
    scrollRightBtn.innerHTML = "›";

    wrapper.appendChild(scrollLeftBtn);
    wrapper.appendChild(tabContainer);
    wrapper.appendChild(scrollRightBtn);

    const userSection = sectionParent.querySelector(".users-section.top");
    if (userSection) {
      sectionParent.insertBefore(wrapper, userSection);
    }

    const updateScrollButtonsVisibility = () => {
      const isScrollable = tabContainer.scrollWidth > tabContainer.clientWidth;
      if (!isScrollable) {
        scrollLeftBtn.classList.remove("visible");
        scrollRightBtn.classList.remove("visible");
        return;
      }
      scrollLeftBtn.classList.toggle("visible", tabContainer.scrollLeft > 1);
      const isAtEnd = tabContainer.scrollWidth - tabContainer.clientWidth - tabContainer.scrollLeft < 1;
      scrollRightBtn.classList.toggle("visible", !isAtEnd);
    };

    const scrollAmount = 150;
    scrollLeftBtn.addEventListener("click", () => {
      tabContainer.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    });
    scrollRightBtn.addEventListener("click", () => {
      tabContainer.scrollBy({ left: scrollAmount, behavior: "smooth" });
    });

    const debouncedUpdate = debounce(updateScrollButtonsVisibility, 50);
    tabContainer.addEventListener("scroll", debouncedUpdate);
    new ResizeObserver(updateScrollButtonsVisibility).observe(tabContainer);
    setTimeout(updateScrollButtonsVisibility, 100);
  };

  /**
   * 범용 사이드바 섹션 생성 및 채우기 함수 (DOM 재활용 및 정렬 기능 내장)
   * @param {object} config - 섹션 설정 객체
   * @param {string} config.id - 섹션 ID (예: 'follow', 'top')
   * @param {string} config.title - 섹션 제목 (예: '즐겨찾기 채널')
   * @param {string} config.href - 섹션 제목 링크
   * @param {string} config.iconHtml - 최소화 시 보일 아이콘 HTML
   * @param {string} config.containerSelector - 채널 목록이 들어갈 컨테이너의 CSS 선택자
   * @param {function(): Promise<Array>} config.fetchData - 채널 데이터 배열을 반환하는 비동기 함수
   * @param {function(object, ...any): HTMLElement} config.createElement - 단일 채널 요소를 생성하는 함수
   * @param {string} config.showMoreButtonId - '더 보기' 버튼에 사용할 ID
   * @param {number} config.displayCount - 초기에 보여줄 채널 수
   * @param {boolean} [update=false] - 전체 업데이트 여부
   */
  const createAndPopulateSection = async (config, update = false) => {
    const { id, containerSelector, fetchData, createElement, displayCount, showMoreButtonId } = config;

    const sectionContainer = document.querySelector(containerSelector);
    if (!sectionContainer) {
      // 최초 로딩 시 컨테이너가 없을 수 있으므로 이 부분은 유지
      const sidebar = document.getElementById("sidebar");
      if (!sidebar || update) return; // 업데이트 시에는 컨테이너가 반드시 있어야 함

      const { title, href, iconHtml } = config;
      const sectionHtml = `
            <div class="top-section ${id}" style="display: none">
                <span class="max"><a href="${href}">${title}</a></span>
                <span class="min"><a href="${href}">${iconHtml}</a></span>
            </div>
            <div class="users-section ${id}"></div>
        `;
      sidebar.insertAdjacentHTML("beforeend", sectionHtml);
    }

    const container = document.querySelector(containerSelector);
    if (!container) return;

    const topSection = document.querySelector(`.top-section.${id}`);
    let sectionParentNode = topSection?.parentNode;

    if (!sectionParentNode) {
      const sidebar = document.getElementById("sidebar");
      if (!sidebar || update) return;

      const { title, href, iconHtml } = config;
      const sectionHtml = `
            <div class="section-wrapper ${id}">
                <div class="top-section ${id}" style="display: none">
                    <span class="max"><a href="${href}">${title}</a></span>
                    <span class="min"><a href="${href}">${iconHtml}</a></span>
                </div>
                <div class="users-section ${id}"></div>
            </div>`;
      sidebar.insertAdjacentHTML("beforeend", sectionHtml);
      sectionParentNode = sidebar.querySelector(`.section-wrapper.${id}`);
    }

    // --- 최초 로딩 로직 ---
    if (!update) {
      try {
        const channels = await fetchData();
        if (!channels || channels.length === 0) {
          container.innerHTML = "";
          return;
        }

        if (topSection) topSection.style.display = "";

        let userElements = channels.map((cd) => createElement(cd.channel, cd.type, ...cd.args)).filter(Boolean);

        // 정렬
        if (id === "follow") userElements = sortFollowSection(userElements);
        else if (id === "myplus" && !myplusOrder) userElements.sort(compareWatchers);
        else if (id === "top" || id === "myplusvod") userElements.sort(compareWatchers);

        const fragment = document.createDocumentFragment();
        userElements.forEach((el) => fragment.appendChild(el));

        container.innerHTML = "";
        container.appendChild(fragment);

        const allUsers = Array.from(container.children);
        const limit = displayCount;
        allUsers.slice(limit).forEach((el) => el.classList.add("show-more"));

        if (allUsers.length > limit) {
          const hiddenCount = allUsers.length - limit;
          createShowMoreButton(container, showMoreButtonId, hiddenCount, limit);
        }

        // 즐겨찾기 그룹 탭 생성
        if (id === "follow") {
          await createFavoriteGroupTabs(sectionParentNode);
        }

        // 인기 채널 카테고리 탭 생성
        if (id === "top") {
          await createCategoryTabs(sectionParentNode);
        }

        makeThumbnailTooltip();
      } catch (error) {
        customLog.error(`[${id}] 섹션 로딩 실패:`, error);
        container.innerHTML = `<div class="error-indicator">오류: ${error.message}</div>`;
      }
    }
    // --- 업데이트 로직 (컨테이너 교체 방식) ---
    else {
      const openListCount = container.querySelectorAll(".user:not(.show-more)").length;

      try {
        const newChannelsData = await fetchData();

        // 1. 새로운 컨테이너를 메모리상에 생성
        const newContainer = container.cloneNode(false); // 자식 노드 없이 껍데기만 복제

        if (!newChannelsData || newChannelsData.length === 0) {
          newContainer.innerHTML = "";
        } else {
          if (topSection) topSection.style.display = "";

          let userElements = newChannelsData.map((cd) => createElement(cd.channel, cd.type, ...cd.args)).filter(Boolean);

          // 2. 정렬
          if (id === "follow") userElements = sortFollowSection(userElements);
          else if (id === "myplus" && !myplusOrder) userElements.sort(compareWatchers);
          else if (id === "top" || id === "myplusvod") userElements.sort(compareWatchers);

          const fragment = document.createDocumentFragment();
          userElements.forEach((el) => fragment.appendChild(el));
          newContainer.appendChild(fragment);

          // 3. 새 컨테이너에 '더 보기/접기' 상태 적용
          const allUsers = Array.from(newContainer.children);
          const limit = openListCount > displayCount ? openListCount : displayCount;

          allUsers.slice(limit).forEach((el) => el.classList.add("show-more"));

          if (allUsers.length > displayCount) {
            const hiddenCount = allUsers.filter((el) => el.classList.contains("show-more")).length;
            createShowMoreButton(newContainer, showMoreButtonId, hiddenCount, displayCount);
          }
        }

        // 4. 모든 준비가 끝난 새 컨테이너로 기존 컨테이너를 교체
        container.parentNode.replaceChild(newContainer, container);

        // 툴팁은 교체된 새 컨테이너의 요소들에 대해 다시 실행
        makeThumbnailTooltip();
      } catch (error) {
        customLog.error(`[${id}] 섹션 업데이트 실패:`, error);
      }
    }
  };

  /**
   * 즐겨찾기 섹션의 복합적인 정렬 로직을 처리하는 함수
   * @param {Array<HTMLElement>} elements - 정렬할 유저 요소 배열
   * @returns {Array<HTMLElement>} 복합 정렬된 유저 요소 배열
   */
  const sortFollowSection = (elements) => {
    const categories = {
      pinnedOnline: [],
      pinnedOffline: [],
      notifiedOnline: [],
      blocked: [],
      normalOnline: [],
      other: [],
    };

    elements.forEach((user) => {
      const isPin = user.getAttribute("is_pin") === "Y";
      const hasBroadThumbnail = user.hasAttribute("broad_thumbnail");
      const isMobilePush = user.getAttribute("is_mobile_push") === "Y";
      const isOffline = user.hasAttribute("is_offline");
      const broad_cate_no = user.getAttribute("broad_cate_no");
      const isBlocked = isBlockedCategorySortingEnabled && blockedCategories.some((b) => b.categoryId === broad_cate_no);

      if (isPin && hasBroadThumbnail) categories.pinnedOnline.push(user);
      else if (isPin) categories.pinnedOffline.push(user);
      else if (isMobilePush && !isOffline) categories.notifiedOnline.push(user);
      else if (isBlocked) categories.blocked.push(user);
      else if (!isMobilePush && !isOffline) categories.normalOnline.push(user);
      else categories.other.push(user);
    });

    // 각 카테고리 내부 정렬
    const sortOrder = isRandomSortEnabled ? stableRandomOrder : compareWatchers;
    Object.keys(categories).forEach((key) => {
      categories[key].sort(key === "other" ? compareWatchers : sortOrder);
    });

    return [...categories.pinnedOnline, ...categories.pinnedOffline, ...categories.notifiedOnline, ...categories.normalOnline, ...categories.blocked, ...categories.other];
  };

  /**
   * 즐겨찾기 섹션의 데이터를 가져옵니다.
   * @returns {Promise<Array>} 채널 정보 배열
   */
  const fetchDataForFollowSection = async () => {
    // [수정] 선택된 그룹에 따라 API URL을 동적으로 변경
    const soopApiUrl = selectedFavoriteGroupIdx === "all" ? "https://myapi.sooplive.co.kr/api/favorite" : `https://myapi.sooplive.co.kr/api/favorite/${selectedFavoriteGroupIdx}`;

    const [soopData, feedData] = await Promise.all([fetchBroadList(soopApiUrl, 50), isChannelFeedEnabled ? getStationFeed() : Promise.resolve([])]);

    if (selectedFavoriteGroupIdx === "all" && soopData?.data) {
      extractFollowUserIds(soopData);
    }

    const feedUserIdSet = new Set(feedData.map((item) => item.station_user_id));
    let combinedList = [];

    // 숲(SOOP) 채널 처리
    if (soopData?.data) {
      soopData.data.forEach((item) => {
        const { is_live, user_id, broad_info } = item;
        const is_mobile_push = isPinnedStreamWithNotificationEnabled === 1 ? item.is_mobile_push : "N";
        const is_pin = isPinnedStreamWithPinEnabled === 1 ? item.is_pin : false;

        if (is_live) {
          broad_info.forEach((channel) => combinedList.push({ channel, args: [is_mobile_push, is_pin], type: "soop_live" }));
        } else if (feedUserIdSet.has(user_id)) {
          feedData.filter((feed) => feed.station_user_id === user_id && !checkIfTimeover(feed.reg_timestamp)).forEach((feedItem) => combinedList.push({ channel: item, args: [feedItem], type: "soop_feed" }));
        } else if (is_pin && !isPinnedOnlineOnlyEnabled) {
          combinedList.push({ channel: item, args: [null], type: "soop_offline" });
        }
      });
    }

    return combinedList;
  };

  /**
   * 인기 채널 섹션의 데이터를 가져옵니다.
   * @returns {Promise<Array>} 채널 정보 배열
   */
  const fetchDataForTopSection = async () => {
    const soopApiUrl = selectedPinnedCategoryIdx === "all" ? "https://live.sooplive.co.kr/api/main_broad_list_api.php?selectType=action&orderType=view_cnt&pageNo=1&lang=ko_KR" : `https://live.sooplive.co.kr/api/main_broad_list_api.php?selectType=cate&selectValue=${selectedPinnedCategoryIdx}&orderType=view_cnt&pageNo=1&lang=ko_KR`;

    const [hiddenBjList, soopData] = await Promise.all([getHiddenbjList(), fetchBroadList(soopApiUrl, 100)]);

    HIDDEN_BJ_LIST.length = 0;
    HIDDEN_BJ_LIST.push(...hiddenBjList);

    let combinedList = [];

    if (soopData?.broad) {
      soopData.broad.forEach((channel) => {
        const isBlocked = blockedWords.some((word) => channel.broad_title.toLowerCase().includes(word.toLowerCase())) || HIDDEN_BJ_LIST.includes(channel.user_id) || isCategoryBlocked(channel.broad_cate_no) || isUserBlocked(channel.user_id) || containsBlockedWord(channel.hash_tags);
        if (!isBlocked) {
          combinedList.push({ channel, args: [0, 0], type: "soop_live" });
        }
      });
    }

    return combinedList;
  };

  /**
   * 추천 채널 및 VOD 섹션의 데이터를 가져옵니다.
   * @returns {Promise<object>} live와 vod를 포함하는 객체
   */
  const fetchDataForMyplusSection = async () => {
    const response = await fetchBroadList("https://live.sooplive.co.kr/api/myplus/preferbjLiveVodController.php?nInitCnt=6&szRelationType=C", 100);

    if (!response || typeof response !== "object" || response.RESULT === -1 || !response.DATA) {
      return { live: [], vod: [] };
    }

    await (isDuplicateRemovalEnabled && displayFollow ? waitForNonEmptyArray() : Promise.resolve());

    const { live_list = [], vod_list = [] } = response.DATA;

    const filterBlocked = (channel, isVod = false) => {
      const title = isVod ? channel.title : channel.broad_title;
      const category = isVod ? channel.category : channel.broad_cate_no;

      const isWordBlockedByTitle = title && blockedWords.some((word) => title.toLowerCase().includes(word.toLowerCase()));

      if (isUserBlocked(channel.user_id) || isCategoryBlocked(category) || isWordBlockedByTitle || containsBlockedWord(channel.hash_tags)) {
        return false;
      }

      if (isDuplicateRemovalEnabled && !isVod && allFollowUserIds.includes(channel.user_id)) {
        return false;
      }

      return true;
    };

    return {
      live: live_list.filter((channel) => filterBlocked(channel, false)).map((channel) => ({ channel, args: [0, 0], type: "soop_live" })),
      vod: vod_list.filter((channel) => filterBlocked(channel, true)).map((channel) => ({ channel, args: [], type: "soop_vod" })),
    };
  };

  /**
   * 범용 createElement 함수
   * 채널 데이터의 타입에 따라 적절한 생성 함수를 호출합니다.
   * @param {object} channel - 채널 데이터
   * @param {string} type - 채널 데이터의 소스 타입
   * @param  {...any} args - 각 생성 함수에 필요한 추가 인자들
   * @returns {HTMLElement | null} 생성된 DOM 요소
   */
  const createUniversalElement = (channel, type, ...args) => {
    switch (type) {
      case "soop_live":
        return createUserElement(channel, ...args);
      case "soop_feed":
      case "soop_offline":
        return createUserElementOffline(channel, ...args);
      case "soop_vod":
        return createUserElementVod(channel, ...args);
      default:
        customLog.warn("알 수 없는 채널 타입:", type, channel);
        return null;
    }
  };

  /**
   * 개선된 사이드바 초기화 함수 (기존 generateBroadcastElements 대체)
   * @param {boolean} [update=false] - 업데이트 여부
   */
  const initializeSidebar = async (update = false) => {
    customLog.log(`방송 목록 갱신 시작: ${new Date().toLocaleString()}`);

    const myplusIcon = IS_DARK_MODE
      ? `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAABkUlEQVR4nO2Wu0oDQRSGExQsBO/BC2Kl4CNY+ABW4hMIFpZi4RuI4gtYCRYm3eE/m4th5uiKKQWDoiAiIqKlqIjaCBYjQyaYFIYsJruI+eHAzuwM/zdnDjMTi7X0l0XkdwNyBOgnQG+lUqorNPN0utADyDGzmIpIhmKez+d7mXWxZKpvmWXGfgPy2nRzIukD5MQZ3hD5Y0QyXmrrh6aae57fzyynbuXXzGrUGBNn1tsOYKdp5rlcbgDQZ26vrzKZ/RHbzyxLDugd2J9oijmRSjDLuVvlJVF+qPwP0Lu23/NksWGGXF3ZlXGRzR4MlscVCoV2QN5qjLeZeQZknYjafg1ApBLV49RUbfPvAGQ1MEDsh3YQeZ6adgCPkQAw62FXOy9RAcy6WjiMCmDNAWxEBCC+q4G50AGMMXG793Zu+eAKFQCQSZf++0ATuUEAzDLv0k+RAACy6QBWIgFg92awh1HoAEqpDkA+AP2ZTO51hgpgjInb29EVYDGQuVW9F0ydsRALKm6M8R2glwObt9TSv9MXwO1y9weCI98AAAAASUVORK5CYII=" style="width:24px">`
      : `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAABmElEQVR4nO2Wu0oDQRSGNyhYCN6DF8RKwUewENKmyWXO2VMkuznHGLQLFr6BKL6AlWChpa2lYCsYFAUREREtRUXURrBQVk+ICpEsJruI+WFgZ3aG/5t/Z2fGspr6yyKa7UTkXUS5BeBVx3E6AjNPpaQLkfcQ5bVSeCMQ82w22w0gJc8UQC6Mkbg+PzTcnKjQg8j7OutzotwIkTuq9euGmqfTuV4AOdC4z4xxhi3LigDwmiaw3jDzTCbTh8iHH0Z8mkxOD3ntxkhRzZ8ApsYaYk6UjwLIkcZ8QiQD5XcAsqXtM3UzxC8ru1IA5DiRKPSX+8VisVZEfqzWX9O6A5AlImr5NQBRPvq5nzEy8ZP5N5AF3wBWlbofEeUmNb2bUACMcQb1r7kPCYCTOn4nFABEXtQElkMCkG1dA+kwACLet/fGljeuQAEAZFxnf+VrINYJwLaZdQ/YDAUAgFc0gfmQAOT9zuBtRoEDxOPFNkR+RpQX13XbgwaIeKejxl/yZe6p1gOmlmLbnLf8CutizpcAPOfbvKmm/p3eAMYsiMeMK5ANAAAAAElFTkSuQmCC" style="width:24px">`;
    const followIcon = IS_DARK_MODE
      ? `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAD1ElEQVR4nO2YXYhVVRTHd6NZ1tAH9CA9CAYJZb4oCdVDUhS9GFQPvSgWPViQiklmRJzCh3orIgijGFAo2Gf9z5mud85aZ6Y69SSSEBrlFGTli0+hqGkf0sSac+/Mvnvy3nvu5wjnBxcunLP+e6191tp77W1MSUlJSckgqFartwLyLJGMAzIN8AWALwF8EpBPgOQJa+2SVjr6ThTxk0T8aW47q3GhphkT8TNxnN3SM8ettcuJ+FWAzwIy0/zHJ6KI77uSVhjK/fpOKx0iPkMke8fGsuu7cn58fPJ2gL9p7XjD4P9owDMzM9fUdYIgGCGS1/RZQa0j6kPHzhPxKU/0GMA7rE3uPnAgvVFnSP8TyW5AfvUGf6+uRSTvNz6TX4B0VxRN3qUaqhWGvIaIdxLJcU/nVOEgNG3cmSeSPwHepjPZzEad9lLqDYDf9Cbh3WapEQTBSBTx8/mY81+iUDrlOT/vfBQlDxawfblJSrzUrk4Y8kYviD0FVhu3YHmbKQggH/2P8x8W1SGSF9zCbmt10qXSzflmaXMlKpXKDUT8nfMVj2uKFdWx1i5xayIM061tBMCxM/s7TIdE0cTq2tp+gmjyzk51iHinMxFow0B+rBvoCmOGTBjyGicjplsaAHx+PoBs1AwZa7NRJyPOtzSobeuzBgcPJjeZIWPt1M0FA9C8nSuaRwfiZRMAecxZiX4wrdDlrlDR9BnKm8e6Px+0NAjD5GEn4n+jSDaYIRHH6Xr1YT4jeGNLI23C8p5nLogvOtkLuiUIghGAv3T8+LZtYyB9yGu+dpsBQ15LUrgeARlzqv/vQaYSwOsA+csZ/+PCItriatW7LbC11RWmz1hbXZG323Oz/722Jh2JxfHEWkAuOnl4tJ+bm7XZqI7hOH8RSO/pSpRIngLksiM6kWXZUtNjsixbqtrOOJf17NwTcW2pvdb4UJIk1/VE3Bizf//Ra3XP8Vrw7aaXALLPW5nGrbXLutW11i5zN6vab5/pBwuDYO7m5sDmzn/mab5j+kl+zm0496adHFY0BYn40ECdrwPw694nnyqy1Om7gHw+FOfrAPKKVxNftdN+6zsAf+19xbfMMNBDt9ts6RpeqVRua3ZhQCSHvZl/2wwTInmxMQg9wC/csfMd1j3oz9psN4uBMEw2N14b8kmiqTvqz62dWgnwT+4mRZQ8ZxYTRPK0Nn1OEL/pzYS16SqAf/buTreYxQjAj7u3aYCcrv3qQV0iSjeZxUyYXwmeW3gzJ38A8oi5GgCSewH+3Zn5s0TpA+ZqIo7T9Vq4+UUZrxu2PyUlJSWmL/wH5eEJ5sFzGH4AAAAASUVORK5CYII=" style="width:20px">`
      : `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAADyUlEQVR4nO1YTWhdVRA+/TH+Ba3gorgQFBS0ulEsqItXFCWLmuZ8k0GSvDtzo/C0YFu0+IfIU7rQnSKCIIo7XYmRIiL+oCsRBbFimwr+ddOVWKy2aovK5OYl552Q9+59P7kp3A8O5OWe+c7MnJk5c45zFSpUqFBhLTA9PX3Z5KTMAjoHyDygfwByGtAfAX3Te/HMvKkbj80hSgHIW5nsAodxzRPJO4Cmu3bploEpzswXAvIkICeI9L/OQ44wJ7euxkWU3mZzcvD8BugTqnpBX8qPj993BaBfdl+wbZwxg51zG1o8zWZzI6BP2bciXIB+YTr0rDyRHIsIvyHSvcyz19fr9YvNQ/Y3oPuJ5OfIiy+1uAB5Ofr2E5E8PDGRXGccxkUk2wDZB8ihaO6xwkZkYRN6Xv6anJQHzJOdZEzpyIvPEMmz0f9e7BQazWZzI5E+aGuGO1EonCwEQuWZk1p+WX109ZBIHsnLQ6Q7IiMey11twoQ1z+dddHlxeW2l8vJqUR5AdoeJnas6WakMY75T2KyGnTsbFxHpt4HyhyzEivIw86b2nEi0q5DV4sBze12PmJhIrl2s7UeA9JpeeQDZFzji7a4CRHq0JWAVxpUMItkWGDDfVQDQk8sG8KgrGcw8GoT0ya4Cdqy3BGZmZi5xJYO5cWlBAyxulzL/blcyvNexICcPdxWwclcoaYYMQOcCfV7pKkCkdwYW/8ss211JYNabTYdAnx155DYs9jytMPq4l7OgXzSzluKTwPtf5xb2Pr0jauL2uzUGVrQkBfORSN4IrP9nLUPJ+/QmQP8O1n+9MEnW4urhsAVm1q1uyGDWrVm7vaT8d9aa9EiW3gjoqSCUvhrm4cbMo7ZGsN4p7+s39EUKKAF6NtiJ92q12mY3YNRqtc3GHSh/1u7OAyG3ljpK6oNjY3vOHwi5c67RaJxnZ064hve6xw0SRHogMmKOmUf65WXmkfCwWhwH3DAQG0Ek7/fzcsDMI0T6bsT5ghsmsntu20580MtlxUIQ0INrqnwLRPp0tOUfFil1NheQj0pRvgUieTzaiU/ztN82h0g/i5R/zpWBxUv3UrNlNXxqauryTg8GRPJ5ZPjzrkwA8lC7EXaBX3liZyfs8kXfZPygS2WvIJJ6+GyYPdrOXt36zpxcSSTfh4cUoPe79QQgudeavkDJX+xlgrl+FZH8EHj+DKCJW4/wXsbbX9PkuI3g92kgvcetZ1D2JPh7/DJHJH96n97lzgV4n94CyK+B508Aers7l8AL99mFxD1qF5Sy9alQoUIFNxT8D3rbJQHjF4hlAAAAAElFTkSuQmCC" style="width:20px">`;
    const topIcon = IS_DARK_MODE
      ? `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAExUlEQVR4nO1ZaYgcVRB+HlkVjyheibckxgNRQZSomB8RFC8MElGiP0T9LSgiASELgkpERRGPxeBqghhfV3XPrpN+1bsx8yMRVOKJENR4H9FVo+sRjbKulDPtfN07Mz1s98xOYD94sDtd7+v63lGv6rUxs5hFb8L35Xxm97k2/dvsSSCKlhDJOLNMVpv7zfPCS8yeAM+LLmWWXXXnq41Iftdnppfhee5idbTutPtaG4ogii4yvQhmOZtIdsKo77A2PINo5BQi+RJEjAdBdK7pJRCVTyRy38HIf2GtLIyf699JEe5ba0dPML0AaysHMcu74NwPRHLaVDtZyCxjYPf22rXRgWYm0d/fvzeR+LjGmcPFzew9Ty7EDU4krBxmpkAkq2BE/2EOb2ijz4pUdFplZgLM4XnM7i+I9Q+031dWg/C/fd9dYLqJUql0MJFsB+c3WWv3abe/2jJLBWZhu+4l0y0QuWfB+Z+nE1GYw+NSYXeN6QZ8X65KreEV0+VilhuTXOEVppMYHKzsz+w+hvX7Yl5OZrceZvOjMAz3M50CkdwDI7/T2vDIvJzM0VG6DIF3pekEgqByaHLNutuL4maO7gDeH60dnWuKBpH0w0s+GRjYOqcobmttH7N81rGzQddlMtcJb812yp2qa5rZbfP9DYuy7JndbclcyfYVJsDzwpuSWWZr8kqlsi+RvAF93sqaMWttnzpe75N9qrcNIjcC03tvtr2snFrQuLvb6Hcf2IeFOK8bill2x8S+Hy7IOqCY3a9pAfqbtS8f26qv729YBAP1p574uQUwR8uB9L1se3kJ7D/QBiLWt9H//fpguWsLEFBPvJjlwda20VKwndAkTUvIaqYa/x4tbc3hHppOgthKwEZ4+fJmdpOTk3vhxtV8CZx6Dje02jbjIZLrQUCUWwBmnRoam9npdOM1CrObDwLmJ4t9WdacZ+R0TC1yC9CTsb4mRw9vZkfk3oFRXj2VRx4GAW824xkeHj4Cy9PcArTgiAk1vje2iZaA87sa5UjWlucly8nG1ysDA1vnYLGTW0B1OcRLqHGOghklkTzTggv2gnuhkU25XD4MuMZzC0hWXtGZ6edaSWnMjm1a3flowQ8C/mh0K+F54Vlg82FuAcxuGKb05vRz33fXYNzP4sNzgSi6eqoAuQX4SgUIkLuA0G/g0NOw/u/PFuAegRF+sgHfEAzYnbkF6PEeH0S6VNLpALPbAg5dmc0XXQ4DshmfBYEcH6ct+k683csFvEFIjxrm8Rj7mwsIF4CAT1vMZqUQ56tOhoshHZjAEIgbuJ0ip1pX1xM2kwzFE/Gzwr8naAEPL/5Gs87a7z/Fvw8NbTw6i6d2HvxfV5v60tkBMxmYolEqjRzDLF/hMR8E7iRm9ypkj9dl8aRynS3WRidjqK7ebJfnmU4gCKJzMNcnku91I4JDr7W6rNUbuWTCJ5uVA/7/Rc8B00kQucv0RbDZ0u3RRtlmLVt9rFk/+s/5Ln2Cqn55wUJlSvn4ijqjFZW26nczt6m5aLdNs9CuOF8XMTqXSJ7AcnMabTeze3zduvCQrjqfFKKb0D2P4TSr1WqDQQ0CplegN3e165c1tY06VpsdbWNE7nUieUpPa2vtATPt7yxmYar4F3KMj24yKDCnAAAAAElFTkSuQmCC" style="width:22px">`
      : `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAEzklEQVR4nO1ZaYgcVRB+URMVb7zibTDGA1FBFA90QSHGY3emq/qhO9Nd1TuR+aegiAhCFgSViIoiHmCI+kOMP4zHD0Ex8UciqOCJENR4H4nX6iYao5JVKjOdru6Znp5s98xOYD940DOvXr2q96req6pnzCxmMZiwli4A4K+lybfZkwBAlwHwJCL/Jw2A/0DkK8yeAERaDMDbQuGjRn9KnxlkIAaXNgTdJfT3jRYpAcCXmEGE44ydA8ATkdnQJmvHzgQITkXkb5U5TVrL55lBAkDtJET+Ua30N9Z6C8N++dZKINJma/0TzSDAWnsgAH+o7P0XAD69lc5bCEA/qR163/O8A8xMYnx8fC9EXq1t3HH4wjR6xOBi7eAA9LzwMDMFAF6mVn7Kdfn67DFBRZ9OALzMzAQcJzgfgP5Rq39Pt2MRablS4l9r/YtMPzEyUjsIkTcqIdZaa/fudrzQAtAbavxG8SXTLwDwSmXHv0/nRHGc6vH62EWkFaYfQPSvjdtwUJkuL9flaoLX1aaXYOb9EOlztfrP5uWJyKuUQ3+2ZMmN+5peAYDvUJNNWDt2ZF6ejuMdJWao+N5ueoFSiQ+N2yzfVBRvRLpZ7eqv1tYPMUUDgMbVKn1Rr9fnFsXbWjsPkb7q2d0gdqljHQBemi1U7TSxaUTaUC77i7LoXZduiMdKdl5hCiCSF48yOzMfGhraB5HeUQq/l7VjtrELm8Mx3dzqu6PAa0qBO7PoxRGTCQ0A39bFuLsU/SuFCC8OBcB/h4zLZTqliwtqaxsFtlpLx3UaWy77i5QZbZcbP7cCjkOuWv2PsugB+Dkl+CfNFv5e1cX4jyP6AHIrEA+86N5OtI4TXK6U3SFBmqSQEqmG/wtNxnz3TSdATAUAvR5NTm4H0jkJx10Z8eCntEMLbfp8/nWK9tXcCuioU47GdLoAdBnFcarHhH3yrZN9AC6n8SmX/TN0aJFbAbkZIwf2D09XgD5QW7+8tZ/vV/3vpvEZHR09QqenuRWQhCNkKOd7WiFLrdq2djGStTw/nk62L6/U6/W5OtnJrUCzqtY0ofYxSiKifKIDr12+gEjPtKOpVCqHKV6ThfqA43hnJfslk5IzO1IyveYjCb86pf5qV5VApLOVkp8WoAC9rFYkaO33S/rcz+YX3QsAwXBrf1BT871YhAK3KgFXJ/sB+HHVf3cWPwB+QNE/2jofvxQp4N+SW4Hm9d68iGh7MhxApPWRifE1WfwQ6Sq1wut0X6kUnKDClild3cuFRAUhtmo6jtdnfxokllI2/mXabsqcpig0nW8qDBH0EagduJskp5FXRwGbib0p0A61UMW+J0gCr5j/IFFnU4Hfwv+Hh5cencVH7gNlQhOR6dAmpdgLpmiMjNSOBeDv9DVfKvHJAPRm+J/rBjaLj451EGm9td6CeJFMKts83/QC1vK5OtYH4J/FEdXvtzoVa6Uilwj41gkPJfwWuQdMLwHgX9mYKJ6wqPZgSrQ5B4AeSh9HW/r2BCUvL4lEJSnMGhFGMqpGHZUWS/20A/0GiUL7Inwi1XxEp5u726Ax9uFqtXpwX4WPK+ItAOCn9XGa3Xa+WD4ph4AZFEjlrlF+oRXiqPKcJCvcaDu/3wagx+S2ttbuP9PyzmIWpoH/AeaUFWmyMuZqAAAAAElFTkSuQmCC" style="width:22px">`;

    // myplus 데이터를 먼저 가져와서 live와 vod로 분리
    const myplusData = displayMyplus > 0 || displayMyplusvod > 0 ? await fetchDataForMyplusSection() : { live: [], vod: [] };

    // 각 섹션에 대한 설정을 객체 배열로 정의
    allSections = [
      {
        id: "follow",
        title: "즐겨찾기 채널",
        href: "https://www.sooplive.co.kr/my/favorite",
        iconHtml: followIcon,
        containerSelector: ".users-section.follow",
        fetchData: fetchDataForFollowSection,
        createElement: createUniversalElement,
        showMoreButtonId: "toggleButton2",
        displayCount: displayFollow,
        enabled: displayFollow > 0,
      },
      {
        id: "myplus",
        title: "추천 채널",
        href: "#",
        iconHtml: myplusIcon,
        containerSelector: ".users-section.myplus",
        fetchData: async () => myplusData.live,
        createElement: createUniversalElement,
        showMoreButtonId: "toggleButton",
        displayCount: displayMyplus,
        enabled: displayMyplus > 0,
      },
      {
        id: "top",
        title: "인기 채널",
        href: "https://www.sooplive.co.kr/live/all",
        iconHtml: topIcon,
        containerSelector: ".users-section.top",
        fetchData: fetchDataForTopSection,
        createElement: createUniversalElement,
        showMoreButtonId: "toggleButton3",
        displayCount: displayTop,
        enabled: displayTop > 0,
      },
      {
        id: "myplusvod",
        title: "추천 VOD",
        href: "#",
        iconHtml: myplusIcon,
        containerSelector: ".users-section.myplusvod",
        fetchData: async () => myplusData.vod,
        createElement: createUniversalElement,
        showMoreButtonId: "toggleButton4",
        displayCount: displayMyplusvod,
        enabled: displayMyplusvod > 0,
      },
    ];

    // 저장된 순서(sidebarSectionOrder)에 따라 섹션 배열을 재정렬
    const sectionMap = new Map(allSections.map((s) => [s.id, s]));
    const sections = sidebarSectionOrder.map((id) => sectionMap.get(id)).filter(Boolean);

    // 활성화된 섹션만 병렬로 처리
    const activeSections = sections.filter((s) => s.enabled);
    await Promise.all(activeSections.map((config) => createAndPopulateSection(config, update)));

    customLog.log(`방송 목록 갱신 완료: ${new Date().toLocaleString()}`);
  };

  /**
   * 기존 generateBroadcastElements 함수는 이 새로운 함수를 호출하도록 변경합니다.
   */
  const generateBroadcastElements = async (update) => {
    // 갱신 시에는, 기존에 표시되던 섹션만 다시 로드합니다.
    if (update) {
      await initializeSidebar(true);
      return;
    }

    // 첫 로딩 시, 모든 활성화된 섹션을 렌더링합니다.
    await initializeSidebar(false);
  };

  /* const makeTopNavbarAndSidebar = (page) => {
        // .left_navbar를 찾거나 생성
        let leftNavbar = document.body.querySelector('.left_navbar');
        if (!leftNavbar) {
            leftNavbar = document.createElement('div');
            leftNavbar.className = 'left_navbar';

            (async () => {
                const serviceHeaderDiv = await waitForElementAsync('#serviceHeader');
                serviceHeaderDiv.prepend(leftNavbar);
            })()
        }*/
  const makeTopNavbarAndSidebar = (page) => {
    // [1] 확장프로그램용 왼쪽 사이드바(메뉴바) 관리
    let leftNavbar = document.body.querySelector(".left_navbar");

    // 메뉴바가 없을 때만 생성 (중복 실행 방지)
    if (!leftNavbar) {
      leftNavbar = document.createElement("div");
      leftNavbar.className = "left_navbar";

      // 1-1. 버튼 생성 로직
      const buttonFragment = document.createDocumentFragment();
      BUTTON_DATA.reverse().forEach((data) => {
        const newButton = document.createElement("a");
        newButton.innerHTML = `<button type="button" class="left_nav_button">${data.text}</button>`;

        const isTargetUrl = CURRENT_URL.startsWith("https://www.sooplive.co.kr");
        const triggerClick = (event) => {
          event.preventDefault();
          const targetElement = isTargetUrl && data.onClickTarget ? document.querySelector(data.onClickTarget) : null;
          if (targetElement) {
            targetElement.click();
          } else {
            customLog.warn("타겟 요소를 찾을 수 없음:", data.onClickTarget);
          }
        };

        if (isTargetUrl && data.onClickTarget) {
          const observer = new MutationObserver((mutations, obs) => {
            const targetElement = document.querySelector(data.onClickTarget);
            if (targetElement) {
              obs.disconnect();
              newButton.addEventListener("click", triggerClick);
            }
          });
          observer.observe(document.body, { childList: true, subtree: true });
        } else {
          newButton.href = data.href;
          newButton.target = isOpenNewtabEnabled ? "_blank" : "_self";
        }
        buttonFragment.appendChild(newButton);
      });
      leftNavbar.appendChild(buttonFragment);

      // 1-2. 헤더에 메뉴바 붙이기 (비동기)
      (async () => {
        const serviceHeaderDiv = await waitForElementAsync("#serviceHeader");
        serviceHeaderDiv.prepend(leftNavbar);
      })();

      // 1-3. [핵심] 방송국 vs 일반 페이지 레이아웃 관리자
      const maintainStationLayout = () => {
        // (1) 왼쪽 강제 여백 제거 & 우측 사이드바 삭제
        if (document.body.classList.contains("customSidebar")) {
          document.body.classList.remove("customSidebar");
        }
        const oldSidebar = document.getElementById("sidebar");
        if (oldSidebar) oldSidebar.remove();

        // (2) 중앙 레이아웃(메인) 강제 확장
        const stationMain = document.querySelector('div[class*="layout_stationMain"]');
        if (stationMain) {
          stationMain.style.setProperty("max-width", "none", "important");
          stationMain.style.setProperty("width", "100%", "important");
          stationMain.style.setProperty("grid-template-columns", "1fr", "important");
          stationMain.style.setProperty("padding-right", "0px", "important");
        }

        // ★★★ (3) [방송국 전용] 상단 버튼 & 로고 위치 조정 ★★★
        const btnFlexible = document.querySelector(".btn_flexible");
        if (btnFlexible) {
          btnFlexible.style.setProperty("margin-left", "-20px", "important");
        }

        const logoWrap = document.querySelector(".logo_wrap");
        if (logoWrap) {
          logoWrap.style.setProperty("margin-left", "-25px", "important");
        }

        // (4) [방송국 전용] 확장프로그램 메뉴바 위치 이동
        if (leftNavbar) {
          leftNavbar.style.setProperty("left", "130px", "important");
        }
      };

      const restoreDefaultLayout = () => {
        // (일반 모드) 왼쪽 강제 여백 복구
        if (!document.body.classList.contains("customSidebar")) {
          document.body.classList.add("customSidebar");
        }

        // ★★★ [복구] 상단 버튼 & 로고 위치 초기화 (방송국 설정 제거) ★★★
        const btnFlexible = document.querySelector(".btn_flexible");
        if (btnFlexible) {
          btnFlexible.style.removeProperty("margin-left"); // 원래대로
        }

        const logoWrap = document.querySelector(".logo_wrap");
        if (logoWrap) {
          logoWrap.style.removeProperty("margin-left"); // 원래대로
        }

        // 메뉴바 위치 원상복구
        if (leftNavbar) {
          leftNavbar.style.removeProperty("left");
        }

        // 삭제된 사이드바 부활 및 내용물 채우기
        if (!document.getElementById("sidebar")) {
          const sidebarClass = isSidebarMinimized ? "min" : "max";
          const sidebarHtml = `<div id="sidebar" class="${sidebarClass}"></div>`;

          if (window.location.href.includes("/player/")) {
            document.body.insertAdjacentHTML("beforeend", sidebarHtml);
          } else {
            const gnb = document.getElementById("soop-gnb");
            if (gnb) gnb.insertAdjacentHTML("afterend", sidebarHtml);
          }

          // 내용물 다시 채워 넣기 (초기화)
          if (typeof initializeSidebar === "function") {
            initializeSidebar(false);
          }

          // 툴팁 컨테이너 복구
          if (!document.querySelector(".tooltip-container")) {
            const tooltipContainer = document.createElement("div");
            tooltipContainer.classList.add("tooltip-container");
            document.body.appendChild(tooltipContainer);
          }
        }
      };

      // 1-4. 페이지 변화 감시 시작 (URL 변경 감지)
      const observer = new MutationObserver(() => {
        const currentUrl = window.location.href;
        const isStation = currentUrl.includes("/station/") || currentUrl.includes("ch.sooplive.co.kr");

        if (isStation) {
          maintainStationLayout();
        } else {
          restoreDefaultLayout();
        }
      });

      observer.observe(document.body, { childList: true, subtree: true });

      // 1-5. 최초 실행 (새로고침 직후)
      // 방송국일 때만 실행 (일반 페이지는 건드리지 않음 -> 중복 생성 방지)
      const initialUrl = window.location.href;
      if (initialUrl.includes("/station/") || initialUrl.includes("ch.sooplive.co.kr")) {
        maintainStationLayout();
      }
    } // if (!leftNavbar) 닫힘

    // [2] 페이지별 사이드바 컨텐츠 생성 (최초 로딩 시 사용 - 원래 기능)
    const sidebarClass = isSidebarMinimized ? "min" : "max";
    const existingSidebar = document.getElementById("sidebar");

    if (!document.querySelector(".tooltip-container")) {
      const tooltipContainer = document.createElement("div");
      tooltipContainer.classList.add("tooltip-container");
      document.body.appendChild(tooltipContainer);
    }

    if (page === "main" && !existingSidebar) {
      const newHtml = `<div id="sidebar" class="max"></div>`;
      const serviceLnbElement = document.getElementById("soop-gnb");
      if (serviceLnbElement) {
        serviceLnbElement.insertAdjacentHTML("afterend", newHtml);
      }
    }

    if (page === "player" && !existingSidebar) {
      const sidebarHtml = `<div id="sidebar" class="${sidebarClass}"></div>`;
      document.body.insertAdjacentHTML("beforeend", sidebarHtml);
    }
  };

  /**
   * 유저 UI 요소를 생성하는 함수 (addEventListener 방식으로 개선)
   * @param {object} channel - 채널 데이터 객체
   * @param {string} is_mobile_push - 알림 설정 여부 ('Y'/'N')
   * @param {boolean} is_pin - 상단 고정 여부
   * @returns {HTMLElement} 생성된 a 태그 요소
   */
  const createUserElement = (channel, is_mobile_push, is_pin) => {
    const { user_id, broad_no, total_view_cnt, broad_title, user_nick, broad_start, broad_cate_no, category_name, subscription_only } = channel;

    const isSubOnly = Number(subscription_only || 0) > 0;
    const playerLink = `https://play.sooplive.co.kr/${user_id}/${broad_no}`;

    const userElement = document.createElement("a");
    userElement.className = "user";
    if (isSmallUserLayoutEnabled) userElement.classList.add("small-user-layout");

    userElement.href = playerLink;
    // 중요: 브라우저가 직접 제어하지 못하게 target을 제거하거나 _self로 설정합니다.
    userElement.target = "_self";

    // 클릭 이벤트 가로채기
    userElement.addEventListener(
      "click",
      (event) => {
        // 새 탭 옵션이 켜져 있을 때 (백그라운드 오픈)
        if (isOpenNewtabEnabled && !event.ctrlKey && !event.shiftKey && !event.metaKey) {
          event.preventDefault(); // 브라우저 이동 차단
          event.stopImmediatePropagation(); // 다른 스크립트 방해 금지

          // GM_openInTab을 사용하며 active: false를 주면 화면이 유지됩니다.
          GM_openInTab(playerLink, { active: !isOpenBackgroundTabEnabled, insert: true, setParent: true });
          return false;
        }

        // 새 탭 옵션이 꺼져 있을 때 (기존의 새로고침 없는 전환 로직)
        if (isSendLoadBroadEnabled && !isOpenNewtabEnabled && !event.ctrlKey) {
          if (window.location.href.includes("play.sooplive.co.kr") && unsafeWindow.liveView) {
            event.preventDefault();
            unsafeWindow.liveView.playerController.sendLoadBroad(user_id, broad_no);
          }
        }
      },
      true,
    ); // true를 넣어 이벤트 캡처링 단계에서 가장 먼저 가로챕니다.

    userElement.setAttribute("data-watchers", total_view_cnt);
    userElement.setAttribute("broad_thumbnail", `https://liveimg.sooplive.co.kr/m/${broad_no}`);
    userElement.setAttribute("tooltip", broad_title);
    userElement.setAttribute("user_id", user_id);
    userElement.setAttribute("broad_start", broad_start);
    userElement.setAttribute("broad_cate_no", broad_cate_no);
    userElement.setAttribute("is_mobile_push", is_mobile_push || "N");
    userElement.setAttribute("is_pin", is_pin ? "Y" : "N");

    if (isPreviewModalFromSidebarEnabled) {
      userElement.addEventListener("contextmenu", (event) => {
        previewModalManager.handleSidebarContextMenu(userElement, event);
        event.preventDefault();
      });
    }

    // --- 자식 요소 생성 ---
    const profilePicture = document.createElement("img");
    profilePicture.className = "profile-picture";
    profilePicture.src = `https://stimg.sooplive.co.kr/LOGO/${user_id.slice(0, 2)}/${user_id}/m/${user_id}.webp`;
    profilePicture.loading = "lazy";
    profilePicture.onerror = function () {
      this.onerror = null;
      this.src = `https://profile.img.sooplive.co.kr/LOGO/${user_id.slice(0, 2)}/${user_id}/m/${user_id}.jpg`;
    };

    // (개선) 프로필 사진 클릭 이벤트 핸들러
    profilePicture.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      const isSidebarMinimized = document.getElementById("sidebar")?.offsetWidth === 52;
      const targetUrl = isSidebarMinimized ? playerLink : `https://ch.sooplive.co.kr/${user_id}`;

      if (isOpenNewtabEnabled || !isSidebarMinimized) {
        window.open(targetUrl, "_blank");
      } else {
        if (event.ctrlKey) {
          window.open(playerLink, "_blank");
          return;
        }
        if (isSendLoadBroadEnabled && unsafeWindow.liveView) {
          unsafeWindow.liveView.playerController.sendLoadBroad(user_id, broad_no);
        } else {
          location.href = playerLink;
        }
      }
    });

    // 나머지 UI 요소 생성 (innerHTML을 사용하여 간결하게 처리)
    const usernameText = is_pin || is_mobile_push === "Y" ? `🖈${user_nick}` : user_nick;
    const usernameTitle = is_pin ? "고정됨(상단 고정 켜짐)" : is_mobile_push === "Y" ? "고정됨(알림 받기 켜짐)" : "";
    const descriptionText = category_name || getCategoryName(broad_cate_no);
    const dotSymbol = isSubOnly ? "★" : "●";
    const dotTitle = isSubOnly ? "구독+ 전용" : "";

    userElement.innerHTML = `
        <span class="username" title="${usernameTitle}">${usernameText}</span>
        <span class="description" title="${descriptionText}">${descriptionText}</span>
        <span class="watchers">
            <span class="dot" role="img" title="${dotTitle}">${dotSymbol}</span>${addNumberSeparator(total_view_cnt)}
        </span>
    `;
    userElement.prepend(profilePicture); // 조립된 요소 앞에 프로필 사진 추가

    return userElement;
  };
  const createUserElementVod = (channel) => {
    const { user_id, title_no, view_cnt, title, user_nick, vod_duration, reg_date, thumbnail } = channel;
    const playerLink = `https://vod.sooplive.co.kr/player/${title_no}`;
    const channelPage = `https://ch.sooplive.co.kr/${user_id}`;

    const userElement = document.createElement("a");
    userElement.className = "user";
    if (isSmallUserLayoutEnabled) userElement.classList.add("small-user-layout");
    userElement.href = playerLink;
    // [수정] 브라우저가 화면을 강제로 넘기지 못하게 _self로 고정합니다.
    userElement.target = "_self";

    // [추가] 클릭 시 백그라운드에서 탭을 여는 로직
    userElement.addEventListener(
      "click",
      (event) => {
        if (isOpenNewtabEnabled && !event.ctrlKey && !event.shiftKey && !event.metaKey) {
          event.preventDefault();
          event.stopImmediatePropagation();
          // 화면 유지(active: false) 옵션 사용
          GM_openInTab(playerLink, { active: !isOpenBackgroundTabEnabled, insert: true, setParent: true });
          return false;
        }
      },
      true,
    );

    userElement.setAttribute("data-watchers", view_cnt);
    userElement.setAttribute("broad_thumbnail", thumbnail.replace("http://", "https://"));
    userElement.setAttribute("tooltip", title);
    userElement.setAttribute("user_id", user_id);
    userElement.setAttribute("vod_duration", vod_duration);

    const profilePicture = document.createElement("img");
    profilePicture.className = "profile-picture profile-grayscale";
    profilePicture.src = `https://stimg.sooplive.co.kr/LOGO/${user_id.slice(0, 2)}/${user_id}/m/${user_id}.webp`;
    profilePicture.loading = "lazy";
    profilePicture.onerror = function () {
      this.onerror = null;
      this.src = `https://profile.img.sooplive.co.kr/LOGO/${user_id.slice(0, 2)}/${user_id}/m/${user_id}.jpg`;
    };

    profilePicture.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      const isSidebarMinimized = document.getElementById("sidebar")?.offsetWidth === 52;
      const targetUrl = isSidebarMinimized ? playerLink : channelPage;
      if (isOpenNewtabEnabled || !isSidebarMinimized) {
        window.open(targetUrl, "_blank");
      } else {
        location.href = playerLink;
      }
    });

    userElement.innerHTML = `
        <span class="username" title="${user_nick}">${user_nick}</span>
        <span class="description" title="${vod_duration}">${vod_duration}</span>
        <span class="watchers">${timeSince(reg_date)}</span>
    `;
    userElement.prepend(profilePicture);

    return userElement;
  };

  const createUserElementOffline = (channel, isFeeditem) => {
    const { user_id, user_nick, is_mobile_push, is_pin } = channel;
    const originalLink = isFeeditem ? isFeeditem.url : `https://ch.sooplive.co.kr/${user_id}`;

    const userElement = document.createElement("a");
    userElement.className = "user user-offline";
    if (isSmallUserLayoutEnabled) userElement.classList.add("small-user-layout");
    userElement.href = originalLink;

    userElement.setAttribute("user_id", user_id);
    userElement.setAttribute("is_offline", "Y");
    userElement.setAttribute("is_mobile_push", is_mobile_push || "N");
    userElement.setAttribute("is_pin", is_pin ? "Y" : "N");
    userElement.setAttribute("data-watchers", isFeeditem ? isFeeditem.reg_timestamp : channel.total_view_cnt || 0);

    if (isFeeditem && isFeeditem.photo_cnt > 0) {
      userElement.setAttribute("broad_thumbnail", `https:${isFeeditem.photos[0].url}`);
      userElement.setAttribute("tooltip", isFeeditem.title_name);
    } else if (isFeeditem) {
      userElement.setAttribute("tooltip", isFeeditem.title_name);
      userElement.setAttribute("data-tooltip-listener", "false");
    } else {
      userElement.setAttribute("data-tooltip-listener", "false");
    }

    const profilePicture = document.createElement("img");
    profilePicture.className = "profile-picture profile-grayscale";
    profilePicture.src = `https://stimg.sooplive.co.kr/LOGO/${user_id.slice(0, 2)}/${user_id}/m/${user_id}.webp`;
    profilePicture.loading = "lazy";
    profilePicture.onerror = function () {
      this.onerror = null;
      this.src = `https://profile.img.sooplive.co.kr/LOGO/${user_id.slice(0, 2)}/${user_id}/m/${user_id}.jpg`;
    };

    const usernameText = is_pin ? `🖈${user_nick}` : user_nick;
    const descriptionText = isFeeditem ? isFeeditem.title_name : "";
    const watchersHTML = isFeeditem ? isFeeditem.reg_date_human : '<span class="dot profile-grayscale" role="img">●</span>오프라인';

    const usernameSpan = document.createElement("span");
    usernameSpan.className = "username";
    usernameSpan.title = usernameText;
    usernameSpan.textContent = usernameText;

    const descriptionSpan = document.createElement("span");
    descriptionSpan.className = "description";
    descriptionSpan.title = descriptionText;
    descriptionSpan.textContent = descriptionText;

    const watchersSpan = document.createElement("span");
    watchersSpan.className = "watchers";
    watchersSpan.innerHTML = watchersHTML;

    userElement.appendChild(profilePicture);
    userElement.appendChild(usernameSpan);
    userElement.appendChild(descriptionSpan);
    userElement.appendChild(watchersSpan);

    if (originalLink.includes("/post/")) {
      const iframeUrl = new URL(originalLink);
      iframeUrl.searchParams.set("iframe", "true");

      userElement.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();

        const title = userElement.querySelector(".username")?.textContent || "오프라인 채널";

        offlineUserModal?.destroy();

        const fixedWidth = 700;
        const fixedHeight = window.innerHeight * 0.9;

        const topPos = (window.innerHeight - fixedHeight) / 2;
        const leftPos = (window.innerWidth - fixedWidth) / 2;

        offlineUserModal = new DraggableResizableModal(
          `offline-user-modal-${user_id}`,
          title,
          {
            width: `${fixedWidth}px`,
            height: `${fixedHeight}px`,
            top: `${topPos}px`,
            left: `${leftPos}px`,
          },
          { ignoreSavedState: true },
        );

        const modalElement = offlineUserModal.getModalElement();

        const resizeHandle = modalElement.querySelector(`.${scopedClass("modal-resize-handle")}`);
        if (resizeHandle) {
          resizeHandle.style.display = "none";
        }
        const headerElement = modalElement.querySelector(`.${scopedClass("modal-header")}`);
        if (headerElement) {
          headerElement.style.cursor = "default";
        }

        const contentArea = offlineUserModal.getContentElement();
        contentArea.style.padding = "0";
        contentArea.style.overflow = "hidden";
        contentArea.innerHTML = `
                <iframe src="${iframeUrl.href}" style="width: 100%; height: 100%; border: none;"></iframe>
            `;

        const handleOutsideClick = (e) => {
          if (modalElement && !modalElement.contains(e.target)) {
            offlineUserModal?.destroy();
            offlineUserModal = null;
            document.body.removeEventListener("click", handleOutsideClick, true);
          }
        };
        setTimeout(() => {
          document.body.addEventListener("click", handleOutsideClick, { capture: true, once: true });
        }, 0);

        offlineUserModal.show();
      });
    } else {
      userElement.target = "_blank";
    }

    return userElement;
  };

  const insertFoldButton = () => {
    const foldButton = `
        <div class="button-fold-sidebar" role="button"></div>
        <div class="button-unfold-sidebar" role="button"></div>
        `;

    const webplayer_scroll = document.getElementById("webplayer_scroll") || document.getElementById("list-container");
    const serviceLnbElement = document.getElementById("sidebar");

    if (serviceLnbElement) {
      serviceLnbElement.insertAdjacentHTML("beforeend", foldButton);

      // 클릭 이벤트 리스너를 정의
      const toggleSidebar = () => {
        isSidebarMinimized = !isSidebarMinimized;

        // max 클래스가 있으면 제거하고 min 클래스 추가
        if (serviceLnbElement.classList.toggle("max")) {
          serviceLnbElement.classList.remove("min");
          webplayer_scroll.style.left = "240px";
        } else {
          serviceLnbElement.classList.remove("max");
          serviceLnbElement.classList.add("min");
          webplayer_scroll.style.left = "52px";
        }

        // isSidebarMinimized 값을 저장
        GM_setValue("isSidebarMinimized", isSidebarMinimized ? 1 : 0);
      };

      // 버튼에 클릭 이벤트 리스너 추가
      const buttons = serviceLnbElement.querySelectorAll(".button-fold-sidebar, .button-unfold-sidebar");
      for (const button of buttons) {
        button.addEventListener("click", toggleSidebar);
      }
    }
  };

  const extractFollowUserIds = (response) => {
    allFollowUserIds = response.data.map((item) => item.user_id); // 모든 user_id를 추출하여 전역 배열에 저장
    GM_setValue("allFollowUserIds", allFollowUserIds);
  };

  const containsBlockedWord = (tagArray) => {
    return tagArray?.some((tag) => blockedWords.some((word) => tag.toLowerCase().includes(word.toLowerCase()))) ?? false;
  };

  const makeThumbnailTooltip = () => {
    try {
      const sidebar = document.getElementById("sidebar");
      // 1. NodeList를 처음에 한 번만 배열로 변환하여 재사용
      const elements = sidebar.querySelectorAll("a.user");
      const elementsArray = Array.from(elements); // 개선점 1 적용

      const tooltipContainer = document.querySelector(".tooltip-container");
      const hoverTimeouts = new Map();

      elements.forEach((element) => {
        const isOffline = element.getAttribute("data-tooltip-listener") === "false";
        if (isOffline) return;

        const hasEventListener = element.getAttribute("data-tooltip-listener") === "true";
        if (!hasEventListener) {
          element.addEventListener("mouseenter", (e) => {
            const uniqueId = `tooltip-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
            element.setAttribute("data-hover-tooltip-id", uniqueId);

            const timeoutId = setTimeout(() => {
              if (element.matches(":hover") && element.getAttribute("data-hover-tooltip-id") === uniqueId) {
                showTooltip(element, uniqueId);
              }
            }, 48);
            hoverTimeouts.set(element, timeoutId);
          });

          element.addEventListener("mouseleave", (e) => {
            element.removeAttribute("data-hover-tooltip-id");

            const timeoutId = hoverTimeouts.get(element);
            if (timeoutId) {
              clearTimeout(timeoutId);
              hoverTimeouts.delete(element);
            }

            const to = e.relatedTarget;
            const isGoingToAnotherElement = elementsArray.some((el) => {
              const isOffline = el.getAttribute("data-tooltip-listener") === "false";
              return el !== element && el.contains(to) && !isOffline;
            });
            if (!isGoingToAnotherElement) {
              tooltipContainer.classList.remove("visible");
              tooltipContainer.removeAttribute("data-tooltip-id");
              tooltipContainer.innerHTML = ""; // 초기화
            }
          });

          // 'window' 이벤트 리스너는 루프 안에서 제거

          element.setAttribute("data-tooltip-listener", "true");
        }
      });

      // 2. 'window' 이벤트 리스너는 루프 밖에서 한 번만 등록
      if (!window.hasMyTooltipMouseOutListener) {
        // 중복 등록을 막기 위한 플래그
        window.addEventListener("mouseout", (e) => {
          if (!e.relatedTarget && !e.toElement) {
            tooltipContainer.classList.remove("visible");
            tooltipContainer.innerHTML = "";
          }
        });
        window.hasMyTooltipMouseOutListener = true; // 플래그 설정
      }

      async function showTooltip(element, uniqueId) {
        // hover 중인지 다시 검사
        if (element.getAttribute("data-hover-tooltip-id") !== uniqueId) return;

        tooltipContainer.setAttribute("data-tooltip-id", uniqueId);

        const topBarHeight = document.getElementById("serviceHeader")?.offsetHeight ?? 0;
        const isScreenMode = document.body.classList.contains("screen_mode");
        const { left: elementX, top: elementY } = element.getBoundingClientRect();
        const offsetX = elementX + sidebar.offsetWidth;
        const offsetY = Math.max(elementY - 260, isScreenMode ? 0 : topBarHeight);

        let imgSrc = element.getAttribute("broad_thumbnail");
        const broadTitle = element.getAttribute("tooltip");
        let broadStart = element.getAttribute("broad_start");
        const vodDuration = element.getAttribute("vod_duration");
        const randomTimeCode = Date.now();
        const userId = element.getAttribute("user_id");

        if (element.getAttribute("data-hover-tooltip-id") !== uniqueId) return;

        // 방송 시간 && 이미지 && !게시판이미지
        if (isReplaceEmptyThumbnailEnabled && broadStart && imgSrc?.startsWith("http") && !imgSrc?.startsWith("https://stimg.")) {
          imgSrc += `?${Math.floor(randomTimeCode / 10000)}`;
        }

        let durationText = broadStart ? getElapsedTime(broadStart, "HH:MM") : vodDuration;

        let tooltipText = "";
        if (sidebar.offsetWidth === 52) {
          const username = element.querySelector("span.username")?.textContent ?? "";
          const description = element.querySelector("span.description")?.textContent ?? "";
          let watchers = element.querySelector("span.watchers")?.textContent ?? "";
          watchers = watchers.replace("●", "").trim();
          tooltipText = `${username} · ${description} · ${watchers}<br>${broadTitle}`;
        } else {
          tooltipText = broadTitle;
        }

        const isTooltipVisible = tooltipContainer.classList.contains("visible");
        const isSameTooltip = tooltipContainer.getAttribute("data-tooltip-id") === uniqueId;

        if (isTooltipVisible && isSameTooltip) {
          const imgEl = tooltipContainer.querySelector("img");
          if (imgEl) imgEl.src = imgSrc;
          else {
            const newImg = document.createElement("img");
            newImg.src = imgSrc;
            tooltipContainer.prepend(newImg);
          }

          const durationOverlay = tooltipContainer.querySelector(".duration-overlay");
          if (durationOverlay) {
            durationOverlay.textContent = durationText;
          } else if (durationText) {
            const newOverlay = document.createElement("div");
            newOverlay.className = "duration-overlay";
            newOverlay.textContent = durationText;
            tooltipContainer.appendChild(newOverlay);
          }

          const textEl = tooltipContainer.querySelector(".tooltiptext");
          if (textEl) {
            textEl.innerHTML = tooltipText;
          } else {
            const newText = document.createElement("div");
            newText.className = "tooltiptext";
            newText.innerHTML = tooltipText;
            tooltipContainer.appendChild(newText);
          }
        } else {
          let tooltipContent = `<img src="${imgSrc}">`;

          if (durationText) {
            tooltipContent += `<div class="duration-overlay">${durationText}</div>`;
          }

          tooltipContent += `<div class="tooltiptext">${tooltipText}</div>`;
          tooltipContainer.innerHTML = tooltipContent;
        }

        Object.assign(tooltipContainer.style, {
          left: `${offsetX}px`,
          top: `${offsetY}px`,
        });

        tooltipContainer.classList.add("visible");
      }
    } catch (error) {
      customLog.error("makeThumbnailTooltip 함수에서 오류가 발생했습니다:", error);
    }
  };
  /**
   * 사이드바 순서 조정 UI를 생성하고 드래그 앤 드롭 이벤트를 설정하는 함수
   */
  const populateOrderUI = () => {
    const orderListContainer = document.getElementById("sidebar-order-list");
    if (!orderListContainer) return;

    orderListContainer.innerHTML = ""; // 기존 목록 초기화

    const allSectionsInfo = {
      follow: { name: "⭐ 즐겨찾기" },
      top: { name: "🔥 인기" },
      myplus: { name: "👍 추천 LIVE" },
      myplusvod: { name: "🎞️ 추천 VOD" },
    };

    // 현재 저장된 순서대로 UI 아이템 생성
    sidebarSectionOrder.forEach((sectionId) => {
      const sectionInfo = allSectionsInfo[sectionId];
      if (sectionInfo) {
        const item = document.createElement("div");
        item.className = "draggable-item_v8xK4z";
        item.draggable = true;
        item.dataset.sectionId = sectionId;
        item.textContent = sectionInfo.name;
        orderListContainer.appendChild(item);
      }
    });

    // 드래그 앤 드롭 이벤트 리스너 추가
    const draggables = orderListContainer.querySelectorAll(".draggable-item_v8xK4z");
    draggables.forEach((draggable) => {
      draggable.addEventListener("dragstart", () => {
        draggable.classList.add("dragging_v8xK4z");
      });

      draggable.addEventListener("dragend", () => {
        draggable.classList.remove("dragging_v8xK4z");
      });
    });

    orderListContainer.addEventListener("dragover", (e) => {
      e.preventDefault();
      // 마우스의 X좌표(e.clientX)를 기준으로 위치 계산
      const afterElement = getDragAfterElement(orderListContainer, e.clientX);
      const dragging = document.querySelector(".dragging_v8xK4z");
      if (afterElement == null) {
        orderListContainer.appendChild(dragging);
      } else {
        orderListContainer.insertBefore(dragging, afterElement);
      }
    });

    orderListContainer.addEventListener("drop", (e) => {
      e.preventDefault();
      const newOrder = [...orderListContainer.querySelectorAll(".draggable-item_v8xK4z")].map((item) => item.dataset.sectionId);
      sidebarSectionOrder = newOrder;
      GM_setValue("sidebarSectionOrder", newOrder);
      customLog.log("New sidebar order saved:", newOrder);
    });

    // 가로 정렬을 위해 X축 기준으로 다음 요소를 찾는 함수로 수정
    function getDragAfterElement(container, x) {
      const draggableElements = [...container.querySelectorAll(".draggable-item_v8xK4z:not(.dragging_v8xK4z)")];
      return draggableElements.reduce(
        (closest, child) => {
          const box = child.getBoundingClientRect();
          // Y축(top, height) 대신 X축(left, width) 기준으로 offset 계산
          const offset = x - box.left - box.width / 2;
          if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
          } else {
            return closest;
          }
        },
        { offset: Number.NEGATIVE_INFINITY },
      ).element;
    }
  };

  /**
   * '더 보기' 버튼을 생성하고 관련 이벤트를 처리하는 함수 (모든 상태 처리)
   * @param {HTMLElement} container - 버튼이 추가될 부모 컨테이너 요소
   * @param {string} buttonId - 버튼에 할당할 고유 ID
   * @param {number} hiddenCount - 현재 숨겨진 항목의 수
   * @param {number} initialDisplayCount - 초기에 표시되는 항목의 수 (접기 시 기준)
   */
  const createShowMoreButton = (container, buttonId, hiddenCount, initialDisplayCount) => {
    const existingButton = document.getElementById(buttonId);
    if (existingButton) existingButton.remove();

    const toggleButton = document.createElement("button");
    toggleButton.id = buttonId;
    toggleButton.title = "좌클릭: 전체 보기/접기, 우클릭: 초기화";

    // 초기 텍스트 설정
    if (hiddenCount > 0) {
      toggleButton.textContent = `더 보기 (${hiddenCount})`;
    } else {
      toggleButton.textContent = "접기";
    }

    container.appendChild(toggleButton);

    // [수정] 클릭 이벤트: 한 번에 모두 보여주기
    toggleButton.addEventListener("click", () => {
      if (toggleButton.textContent === "접기") {
        // [접기 모드] 처음 설정된 개수(initialDisplayCount)만 남기고 나머지는 숨김
        const allUsers = Array.from(container.querySelectorAll(".user"));
        allUsers.slice(initialDisplayCount).forEach((user) => {
          user.classList.add("show-more");
        });
        const newHiddenCount = allUsers.length - initialDisplayCount;
        toggleButton.textContent = `더 보기 (${newHiddenCount})`;
      } else {
        // [더 보기 모드] 숨겨진 모든 요소를 한 번에 표시
        const hiddenUsers = Array.from(container.querySelectorAll(".user.show-more"));

        hiddenUsers.forEach((user) => user.classList.remove("show-more")); // slice 없이 전체 순회

        // 모두 보여줬으므로 버튼 텍스트는 '접기'로 변경
        toggleButton.textContent = "접기";
      }
    });

    // 우클릭 이벤트 (기존 유지)
    toggleButton.addEventListener("contextmenu", (event) => {
      event.preventDefault();
      const allUsers = Array.from(container.querySelectorAll(".user"));
      allUsers.slice(initialDisplayCount).forEach((user) => user.classList.add("show-more"));
      toggleButton.textContent = `더 보기 (${allUsers.length - initialDisplayCount})`;
    });
  };

  const addModalSettings = (serviceUtilDiv) => {
    const openModalBtn = document.createElement("div");
    openModalBtn.setAttribute("id", "openModalBtn");
    const link = document.createElement("button");
    link.setAttribute("class", "btn-settings-ui");
    openModalBtn.appendChild(link);

    serviceUtilDiv.prepend(openModalBtn);

    // 모달 컨텐츠를 담고 있는 HTML 문자열
    const modalContentHTML = `
<div id="myModal" class="modal_v8xK4z">
    <div class="modal-content_v8xK4z">
        <nav class="modal-index_v8xK4z">
            <h3 class="index-title_v8xK4z">설정 메뉴</h3>
            <button class="index-button_v8xK4z" data-target-id="broadcast-options-title">방송 목록</button>
            <button class="index-button_v8xK4z" data-target-id="sidebar-options-title">사이드바</button>
            <button class="index-button_v8xK4z" data-target-id="live-player-options-title">LIVE 플레이어</button>
            <button class="index-button_v8xK4z" data-target-id="vod-player-options-title">VOD 플레이어</button>
            <button class="index-button_v8xK4z" data-target-id="chat-options-title">채팅창</button>
            <button class="index-button_v8xK4z" data-target-id="recap-options-title">리캡</button>
            <button class="index-button_v8xK4z" data-target-id="etc-options-title">기타</button>
            <button class="index-button_v8xK4z" data-target-id="management-title">차단/부가설명</button>
        </nav>

        <div class="modal-main-content_v8xK4z">
            <header class="modal-header_v8xK4z">
                <h2 id="modal-title" class="modal-title_v8xK4z">확장 프로그램 설정</h2>
                <button class="close-button_v8xK4z" aria-label="닫기">&times;</button>
            </header>

            <div class="modal-body_v8xK4z">
                <section>
                    <h3 id="broadcast-options-title" class="section-title_v8xK4z">방송 목록 옵션</h3>
                      <div class="option_v8xK4z multi-option_v8xK4z">
                        <div class="option-group_v8xK4z">
                            <label for="switchPreviewModal">🖼️썸네일 🖱️클릭시 프리뷰 열기</label>
                            <label class="switch_v8xK4z">
                                <input type="checkbox" id="switchPreviewModal">
                                <span class="slider_v8xK4z round"></span>
                            </label>
                        </div>
                        <div id="switchPreviewModalRightClickContainer" class="option-group_v8xK4z">
                            <label for="switchPreviewModalRightClick">🖱️오른쪽 클릭으로 변경</label>
                            <label class="switch_v8xK4z">
                                <input type="checkbox" id="switchPreviewModalRightClick">
                                <span class="slider_v8xK4z round"></span>
                            </label>
                        </div>
                    </div>
                    <div class="option_v8xK4z multi-option_v8xK4z">
                    <div class="option_v8xK4z">
                        <label for="switchRemoveRedistributionTag">탐방허용 태그 ❌</label>
                        <label class="switch_v8xK4z">
                            <input type="checkbox" id="switchRemoveRedistributionTag">
                            <span class="slider_v8xK4z round"></span>
                        </label>
                    </div>
                    <div class="option_v8xK4z">
                        <label for="switchRemoveWatchLaterButton">나중에 보기 버튼 ❌</label>
                        <label class="switch_v8xK4z">
                            <input type="checkbox" id="switchRemoveWatchLaterButton">
                            <span class="slider_v8xK4z round"></span>
                        </label>
                    </div>
                    <div class="option_v8xK4z">
                        <label for="switchRemoveBroadStartTimeTag">방송 시작 시간 ❌</label>
                        <label class="switch_v8xK4z">
                            <input type="checkbox" id="switchRemoveBroadStartTimeTag">
                            <span class="slider_v8xK4z round"></span>
                        </label>
                    </div>
                    </div>

                    <div class="option_v8xK4z">
                        <label for="switchReplaceEmptyThumbnail">🖱️마우스 오버시 🔞연령 제한 썸네일 보기</label>
                        <label class="switch_v8xK4z">
                            <input type="checkbox" id="switchReplaceEmptyThumbnail">
                            <span class="slider_v8xK4z round"></span>
                        </label>
                    </div>
                    <div class="option_v8xK4z">
                        <label for="switchRemoveCarousel">자동 재생되는 채널 전광판 ❌</label>
                        <label class="switch_v8xK4z">
                            <input type="checkbox" id="switchRemoveCarousel">
                            <span class="slider_v8xK4z round"></span>
                        </label>
                    </div>
                    <div class="option_v8xK4z">
                        <label for="switchBroadTitleTextEllipsis">방송 제목이 긴 경우 ...으로 생략하기</label>
                        <label class="switch_v8xK4z">
                            <input type="checkbox" id="switchBroadTitleTextEllipsis">
                            <span class="slider_v8xK4z round"></span>
                        </label>
                    </div>
                </section>

                <div class="divider_v8xK4z"></div>

                <section>
                    <h3 id="sidebar-options-title" class="section-title_v8xK4z">사이드바 옵션</h3>
                    <div class="option_v8xK4z">
                        <label for="switchCustomSidebar">사이드바 사용 (해제시 기본 사이드바)</label>
                        <label class="switch_v8xK4z">
                            <input type="checkbox" id="switchCustomSidebar">
                            <span class="slider_v8xK4z round"></span>
                        </label>
                    </div>

                    <div class="option_v8xK4z range-option_v8xK4z customSidebarOptionsContainer">
                        <label for="favoriteChannelsDisplay">⌗ [즐겨찾기 채널] 표시 수</label>
                        <div class="range-container_v8xK4z">
                            <input type="range" id="favoriteChannelsDisplay" min="0" max="40" title="0 = 숨김">
                            <span id="favoriteChannelsDisplayValue" class="range-value_v8xK4z">${displayFollow}</span>
                        </div>
                    </div>
                    <div class="option_v8xK4z range-option_v8xK4z customSidebarOptionsContainer">
                        <label for="myPlusChannelsDisplay">⌗ [추천 채널] 표시 수</label>
                        <div class="range-container_v8xK4z">
                            <input type="range" id="myPlusChannelsDisplay" min="0" max="40" title="0 = 숨김">
                            <span id="myPlusChannelsDisplayValue" class="range-value_v8xK4z">${displayMyplus}</span>
                        </div>
                    </div>
                    <div class="option_v8xK4z range-option_v8xK4z customSidebarOptionsContainer">
                        <label for="myPlusVODDisplay">⌗ [추천 VOD] 표시 수</label>
                        <div class="range-container_v8xK4z">
                            <input type="range" id="myPlusVODDisplay" min="0" max="40" title="0 = 숨김">
                            <span id="myPlusVODDisplayValue" class="range-value_v8xK4z">${displayMyplusvod}</span>
                        </div>
                    </div>
                    <div class="option_v8xK4z range-option_v8xK4z customSidebarOptionsContainer">
                        <label for="popularChannelsDisplay">⌗ [인기 채널] 표시 수</label>
                        <div class="range-container_v8xK4z">
                            <input type="range" id="popularChannelsDisplay" min="0" max="40" title="0 = 숨김">
                            <span id="popularChannelsDisplayValue" class="range-value_v8xK4z">${displayTop}</span>
                        </div>
                    </div>

                    <h4 class="subsection-title_v8xK4z customSidebarOptionsContainer">섹션 순서 (드래그하여 순서 변경)</h4>
                    <div id="sidebar-order-list" class="order-list_v8xK4z customSidebarOptionsContainer"></div>
                    <div class="divider_v8xK4z customSidebarOptionsContainer" style="margin-top: 15px; margin-bottom: 15px;"></div>

                    <div class="option_v8xK4z customSidebarOptionsContainer">
                        <label for="switchSmallUserLayout">🥜미니 방송 목록</label>
                        <label class="switch_v8xK4z">
                            <input type="checkbox" id="switchSmallUserLayout">
                            <span class="slider_v8xK4z round"></span>
                        </label>
                    </div>
                    <div class="option_v8xK4z customSidebarOptionsContainer">
                        <label for="switchPreviewModalFromSidebar">🖱️오른쪽 클릭시 프리뷰 열기</label>
                        <label class="switch_v8xK4z">
                            <input type="checkbox" id="switchPreviewModalFromSidebar">
                            <span class="slider_v8xK4z round"></span>
                        </label>
                    </div>
                    <div class="option_v8xK4z customSidebarOptionsContainer">
                        <label for="sendLoadBroadCheck">⚡새로고침 없는 방송 전환 사용</label>
                        <label class="switch_v8xK4z">
                            <input type="checkbox" id="sendLoadBroadCheck">
                            <span class="slider_v8xK4z round"></span>
                        </label>
                    </div>
                    <div class="option_v8xK4z customSidebarOptionsContainer">
                        <label for="switchFavoriteGroups">[⭐즐겨찾기] 📂그룹 탭 표시</label>
                        <label class="switch_v8xK4z">
                            <input type="checkbox" id="switchFavoriteGroups">
                            <span class="slider_v8xK4z round"></span>
                        </label>
                    </div>
                    <div class="option_v8xK4z customSidebarOptionsContainer">
                        <label for="switchShortenFavoriteGroupName">[⭐즐겨찾기] 📂그룹 탭 이름을 한 글자로 축약</label>
                        <label class="switch_v8xK4z">
                            <input type="checkbox" id="switchShortenFavoriteGroupName">
                            <span class="slider_v8xK4z round"></span>
                        </label>
                    </div>
                    <div class="option_v8xK4z customSidebarOptionsContainer">
                        <label for="switchRandomSort">[⭐즐겨찾기] 🔀랜덤 정렬 (해제시 시청자 많은 순)</label>
                        <label class="switch_v8xK4z">
                            <input type="checkbox" id="switchRandomSort">
                            <span class="slider_v8xK4z round"></span>
                        </label>
                    </div>
                    <div class="option_v8xK4z customSidebarOptionsContainer">
                        <label for="switchChannelFeed">[⭐즐겨찾기] 💤오프라인 채널의 최신 글 보기</label>
                        <label class="switch_v8xK4z">
                            <input type="checkbox" id="switchChannelFeed">
                            <span class="slider_v8xK4z round"></span>
                        </label>
                    </div>
                    <div class="option_v8xK4z customSidebarOptionsContainer">
                        <label for="switchBlockedCategorySorting">[⭐즐겨찾기] 🚫차단된 카테고리를 👇하단으로 이동</label>
                        <label class="switch_v8xK4z">
                            <input type="checkbox" id="switchBlockedCategorySorting">
                            <span class="slider_v8xK4z round"></span>
                        </label>
                    </div>
                    <div class="option_v8xK4z customSidebarOptionsContainer">
                        <label for="fixNotificationChannel">[⭐즐겨찾기] 🔔알림 설정된 채널을 📌상단 고정</label>
                        <label class="switch_v8xK4z">
                            <input type="checkbox" id="fixNotificationChannel">
                            <span class="slider_v8xK4z round"></span>
                        </label>
                    </div>
                    <div class="option_v8xK4z customSidebarOptionsContainer">
                        <label for="fixFixedChannel" title="MY 페이지에서 스트리머 고정 버튼(핀 모양)을 누르면 사이드바에 고정이 됩니다.">[⭐즐겨찾기] 스트리머 관리에서 📌고정된 채널을 📌상단 고정<sup>1)</sup></label>
                        <label class="switch_v8xK4z">
                            <input type="checkbox" id="fixFixedChannel">
                            <span class="slider_v8xK4z round"></span>
                        </label>
                    </div>
                    <div class="option_v8xK4z customSidebarOptionsContainer">
                        <label for="switchPinnedOnlineOnly">[⭐즐겨찾기] ☀️온라인일 때만 📌상단 고정하기</label>
                        <label class="switch_v8xK4z">
                            <input type="checkbox" id="switchPinnedOnlineOnly">
                            <span class="slider_v8xK4z round"></span>
                        </label>
                    </div>
                    <div class="option_v8xK4z customSidebarOptionsContainer">
                        <label for="mpSortByViewers">[👍🏻추천채널] 정렬을 👍추천순으로 변경 (해제시 시청자순)</label>
                        <label class="switch_v8xK4z">
                            <input type="checkbox" id="mpSortByViewers">
                            <span class="slider_v8xK4z round"></span>
                        </label>
                    </div>
                    <div class="option_v8xK4z customSidebarOptionsContainer">
                        <label for="removeDuplicates">[👍🏻추천채널] 즐겨찾기 🗐 중복 제거</label>
                        <label class="switch_v8xK4z">
                            <input type="checkbox" id="removeDuplicates">
                            <span class="slider_v8xK4z round"></span>
                        </label>
                    </div>
                    <div class="option_v8xK4z customSidebarOptionsContainer">
                        <label for="switchCategoryGroups">[🔥인기채널] 📂카테고리 탭 표시</label>
                        <label class="switch_v8xK4z">
                            <input type="checkbox" id="switchCategoryGroups">
                            <span class="slider_v8xK4z round"></span>
                        </label>
                    </div>
                    <div class="option_v8xK4z customSidebarOptionsContainer">
                        <label for="switchShortenCategoryName">[🔥인기채널] 📂카테고리 탭 이름을 한 글자로 축약</label>
                        <label class="switch_v8xK4z">
                            <input type="checkbox" id="switchShortenCategoryName">
                            <span class="slider_v8xK4z round"></span>
                        </label>
                    </div>
                    <div class="option_v8xK4z">
                        <label for="openInNewTab">방송 목록 클릭 시 ⿻ 새 탭으로 열기</label>
                        <label class="switch_v8xK4z">
                            <input type="checkbox" id="openInNewTab">
                            <span class="slider_v8xK4z round"></span>
                        </label>
                    </div>
                    <div class="option_v8xK4z" id="openBackgroundTabContainer" style="margin-left: 20px; font-size: 0.9em;">
                      <label for="openBackgroundTab">ㄴ 백그라운드로 열기</label> <label class="switch_v8xK4z">
                        <input type="checkbox" id="openBackgroundTab"> <span class="slider_v8xK4z round"></span>
                        </label>
                    </div>
                </section>

                <div class="divider_v8xK4z"></div>

                <section>
                    <h3 id="live-player-options-title" class="section-title_v8xK4z">LIVE 플레이어 옵션</h3>
                    <div class="option_v8xK4z">
                        <label for="switchNoAutoVOD">방송 종료 후 🤖자동 VOD 재생 ❌</label>
                        <label class="switch_v8xK4z">
                            <input type="checkbox" id="switchNoAutoVOD">
                            <span class="slider_v8xK4z round"></span>
                        </label>
                    </div>
                    <div class="option_v8xK4z" id="redirectLiveOptionContainer">
                        <label for="switchRedirectLive">방송 종료 후 🤖자동 LIVE 이동 ✅<sup>2)</sup>

                        <div class="mapper-setting_v8xK4z">
                            <select id="redirectLiveSortOption">
                                <option value="custom">커스텀</option>
                                <option value="mostViewers">시청자 많은 순</option>
                                <option value="leastViewers">시청자 적은 순</option>
                                <option value="random">랜덤</option>
                            </select>
                        </div>

                        </label>

                        <label class="switch_v8xK4z">
                            <input type="checkbox" id="switchRedirectLive">
                            <span class="slider_v8xK4z round"></span>
                        </label>
                    </div>
                    <div class="option_v8xK4z">
                        <label for="switchHideEsportsInfo">E-Sports 정보 ❌</label>
                        <label class="switch_v8xK4z">
                            <input type="checkbox" id="switchHideEsportsInfo">
                            <span class="slider_v8xK4z round"></span>
                        </label>
                    </div>
                    <div class="option_v8xK4z">
                        <label for="autoClaimGem">💎젬 자동 획득</label>
                        <label class="switch_v8xK4z">
                            <input type="checkbox" id="autoClaimGem">
                            <span class="slider_v8xK4z round"></span>
                        </label>
                    </div>
                    <div class="option_v8xK4z">
                        <label for="showPauseButton">[플레이어] ⏸️일시정지 버튼</label>
                        <label class="switch_v8xK4z">
                            <input type="checkbox" id="showPauseButton">
                            <span class="slider_v8xK4z round"></span>
                        </label>
                    </div>
                    <div class="option_v8xK4z">
                        <label for="switchCaptureButton">[플레이어] LIVE / VOD 📸스크린샷 버튼</label>
                        <label class="switch_v8xK4z">
                            <input type="checkbox" id="switchCaptureButton">
                            <span class="slider_v8xK4z round"></span>
                        </label>
                    </div>
                    <div class="option_v8xK4z">
                            <label for="switchNo1440p"> [플레이어] 🔒화질 고정 (새로고침 시 유지)</label>
                            <label class="switch_v8xK4z">
                                <input type="checkbox" id="switchNo1440p" ${isNo1440pEnabled ? "checked" : ""}>
                                <span class="slider_v8xK4z round"></span>
                            </label>
                        </div>

                    <div class="option_v8xK4z" style="margin-left: 25px; width: auto;">
                        <label for="qualitySelector">└ 고정할 화질 선택</label>
                        <div class="mapper-setting_v8xK4z">
                            <select id="qualitySelector">
                                <option value="최대화질">최대화질 (원본)</option>
                                <option value="1440">1440p</option>
                                <option value="1080">1080p</option>
                                <option value="720">720p</option>
                                <option value="540">540p</option>
                                <option value="360">360p</option>
                            </select>
                        </div>
                    </div>
                    <div class="option_v8xK4z">
                        <label for="switchPlayerAdvancedControlsLive">[플레이어] 영상 🎚️필터 LIVE</label>
                        <label class="switch_v8xK4z">
                            <input type="checkbox" id="switchPlayerAdvancedControlsLive">
                            <span class="slider_v8xK4z round"></span>
                        </label>
                    </div>
                   <div class="option_v8xK4z">
                       <label for="switchPlayerPanzoom">[플레이어] 🔍영상 확대/이동 기능 LIVE</label>
                       <label class="switch_v8xK4z">
                           <input type="checkbox" id="switchPlayerPanzoom">
                           <span class="slider_v8xK4z round"></span>
                       </label>
                   </div>
                    <div class="option_v8xK4z multi-option_v8xK4z">
                    <div class="option_v8xK4z">
                        <label for="switchClickPlayerEventMapper">[플레이어] 🖱️클릭/우클릭 기능 매핑

                        <div class="mapper-setting_v8xK4z">
                            <label for="selectLeftClick">좌</label>
                            <select id="selectLeftClick">
                                <option value="none">없음</option>
                                <option value="toggleMute">음소거</option>
                                <option value="togglePause">일시정지</option>
                                <option value="toggleStop">정지</option>
                                <option value="toggleScreenMode">스크린 모드</option>
                                <option value="toggleFullscreen">전체화면</option>
                            </select>
                        </div>
                        <div class="mapper-setting_v8xK4z">
                            <label for="selectRightClick">우</label>
                            <select id="selectRightClick">
                                <option value="none">없음</option>
                                <option value="toggleMute">음소거</option>
                                <option value="togglePause">일시정지</option>
                                <option value="toggleStop">정지</option>
                                <option value="toggleScreenMode">스크린 모드</option>
                                <option value="toggleFullscreen">전체화면</option>
                            </select>
                        </div>

                        </label>
                        <label class="switch_v8xK4z">
                            <input type="checkbox" id="switchClickPlayerEventMapper">
                            <span class="slider_v8xK4z round"></span>
                        </label>
                    </div>
                    </div>

                    <div class="option_v8xK4z">
                        <label for="showBufferTime">[채팅창] 방송 ⏳딜레이 (남은 버퍼 시간) 표시</label>
                        <label class="switch_v8xK4z">
                            <input type="checkbox" id="showBufferTime">
                            <span class="slider_v8xK4z round"></span>
                        </label>
                    </div>
                    <div class="option_v8xK4z">
                        <label for="switchVideoSkipHandler">[⌨️단축키] 좌/우 방향키를 눌러 1초 전/후로 ⏭️이동</label>
                        <label class="switch_v8xK4z">
                            <input type="checkbox" id="switchVideoSkipHandler">
                            <span class="slider_v8xK4z round"></span>
                        </label>
                    </div>
                    <div class="option_v8xK4z">
                        <label for="switchSharpmodeShortcut">[⌨️단축키] ✨'선명한 모드'(e) 활성화</label>
                        <label class="switch_v8xK4z">
                            <input type="checkbox" id="switchSharpmodeShortcut">
                            <span class="slider_v8xK4z round"></span>
                        </label>
                    </div>
                    <div class="option_v8xK4z">
                        <label for="switchLLShortcut">[⌨️단축키] 🚀'시차 단축'(d) 활성화**</label>
                        <label class="switch_v8xK4z">
                            <input type="checkbox" id="switchLLShortcut">
                            <span class="slider_v8xK4z round"></span>
                        </label>
                    </div>
                    <div class="option_v8xK4z">
                        <label for="switchAdjustDelayNoGrid">[⌨️단축키] (d)를 '앞당기기'로 변경<br>(위 옵션** 활성화 필수, 비 그리드 사용자만)</label>
                        <label class="switch_v8xK4z">
                            <input type="checkbox" id="switchAdjustDelayNoGrid">
                            <span class="slider_v8xK4z round"></span>
                        </label>
                    </div>
                    <div class="option_v8xK4z">
                        <label for="switchQualityChangeShortcut">[⌨️단축키] 화질 변경(1️⃣숫자) 활성화</label>
                        <label class="switch_v8xK4z">
                            <input type="checkbox" id="switchQualityChangeShortcut">
                            <span class="slider_v8xK4z round"></span>
                        </label>
                    </div>

                    <div class="option_v8xK4z">
                        <label for="mutedInactiveTabs">[⿻ 브라우저 탭] 전환시 🔇음소거</label>
                        <label class="switch_v8xK4z">
                            <input type="checkbox" id="mutedInactiveTabs">
                            <span class="slider_v8xK4z round"></span>
                        </label>
                    </div>
                    <div class="option_v8xK4z">
                        <label for="switchAutoChangeQuality">[⿻ 브라우저 탭] 전환시 화질 ⬇️낮추기</label>
                        <label class="switch_v8xK4z">
                            <input type="checkbox" id="switchAutoChangeQuality">
                            <span class="slider_v8xK4z round"></span>
                        </label>
                    </div>

                    <div class="option_v8xK4z">
                        <label for="switchDocumentTitleUpdate">[⿻ 브라우저 탭] 제목에 📊시청자 수 표시</label>
                        <label class="switch_v8xK4z">
                            <input type="checkbox" id="switchDocumentTitleUpdate">
                            <span class="slider_v8xK4z round"></span>
                        </label>
                    </div>
                    <div class="option_v8xK4z">
                        <label for="switchShowSidebarOnScreenModeAlways">[🎬스크린 모드] 항상 사이드바 보기</label>
                        <label class="switch_v8xK4z">
                            <input type="checkbox" id="switchShowSidebarOnScreenModeAlways">
                            <span class="slider_v8xK4z round"></span>
                        </label>
                    </div>
                    <div class="option_v8xK4z">
                        <label for="mouseOverSideBar">[🎬스크린 모드] 좌상단 🖱️마우스 오버시 사이드바 보기</label>
                        <label class="switch_v8xK4z">
                            <input type="checkbox" id="mouseOverSideBar">
                            <span class="slider_v8xK4z round"></span>
                        </label>
                    </div>
                    <div class="option_v8xK4z">
                        <label for="chatPosition">[🎬스크린 모드] ↕️세로로 긴 화면에서 채팅창을 👇아래에 위치</label>
                        <label class="switch_v8xK4z">
                            <input type="checkbox" id="chatPosition">
                            <span class="slider_v8xK4z round"></span>
                        </label>
                    </div>
                    <div class="option_v8xK4z">
                        <label for="switchAutoScreenMode">[🎬스크린 모드] 🤖자동 스크린 모드</label>
                        <label class="switch_v8xK4z">
                            <input type="checkbox" id="switchAutoScreenMode">
                            <span class="slider_v8xK4z round"></span>
                        </label>
                    </div>
                </section>

                <div class="divider_v8xK4z"></div>

                <section>
                    <h3 id="vod-player-options-title" class="section-title_v8xK4z">VOD 플레이어 옵션</h3>
                    <div class="option_v8xK4z">
                        <label for="selectBestQuality">✨최고화질 🤖자동 선택</label>
                        <label class="switch_v8xK4z">
                            <input type="checkbox" id="selectBestQuality">
                            <span class="slider_v8xK4z round"></span>
                        </label>
                    </div>
                    <div class="option_v8xK4z">
                        <label for="switchRemoveShadowsFromCatch">CATCH 플레이어 하단의 그림자 효과 ❌</label>
                        <label class="switch_v8xK4z">
                            <input type="checkbox" id="switchRemoveShadowsFromCatch">
                            <span class="slider_v8xK4z round"></span>
                        </label>
                    </div>
                    <div class="option_v8xK4z">
                        <label for="switchVODHighlight">VOD 💡하이라이트(별별랭킹) 타임라인 활성화</label>
                        <label class="switch_v8xK4z">
                            <input type="checkbox" id="switchVODHighlight">
                            <span class="slider_v8xK4z round"></span>
                        </label>
                    </div>
                    <div class="option_v8xK4z">
                        <label for="switchPlayerAdvancedControlsVOD">[플레이어] 영상 🎚️필터 VOD</label>
                        <label class="switch_v8xK4z">
                            <input type="checkbox" id="switchPlayerAdvancedControlsVOD">
                            <span class="slider_v8xK4z round"></span>
                        </label>
                    </div>
                    <div class="option_v8xK4z">
                        <label for="switchPlayerPanzoomVOD">[플레이어] 🔍영상 확대/이동 기능 VOD</label>
                        <label class="switch_v8xK4z">
                            <input type="checkbox" id="switchPlayerPanzoomVOD">
                            <span class="slider_v8xK4z round"></span>
                        </label>
                    </div>
                </section>

                <div class="divider_v8xK4z"></div>

                <section>
                    <h3 id="chat-options-title" class="section-title_v8xK4z">채팅창 옵션</h3>
                    <div class="option_v8xK4z range-option_v8xK4z">
                        <label for="nicknameWidthDisplay">⌗ [닉네임] 가로 크기 (채팅 메시지 정렬시)</label>
                        <div class="range-container_v8xK4z">
                            <input type="range" id="nicknameWidthDisplay" min="86" max="186">
                            <span id="nicknameWidthDisplayValue" class="range-value_v8xK4z">${nicknameWidth}</span>
                        </div>
                    </div>
                    <div class="option_v8xK4z">
                        <label for="switchAlignNicknameRight">[닉네임] ➡️오른쪽으로 붙이기 (채팅 메시지 정렬시)</label>
                        <label class="switch_v8xK4z">
                            <input type="checkbox" id="switchAlignNicknameRight">
                            <span class="slider_v8xK4z round"></span>
                        </label>
                    </div>

                    <div class="option_v8xK4z multi-option_v8xK4z">
                    <div class="option_v8xK4z">
                        <label for="selectHideSupporterBadge">서포터 배지 ❌</label>
                        <label class="switch_v8xK4z">
                            <input type="checkbox" id="selectHideSupporterBadge">
                            <span class="slider_v8xK4z round"></span>
                        </label>
                    </div>
                    <div class="option_v8xK4z">
                        <label for="selectHideFanBadge">팬 배지 ❌</label>
                        <label class="switch_v8xK4z">
                            <input type="checkbox" id="selectHideFanBadge">
                            <span class="slider_v8xK4z round"></span>
                        </label>
                    </div>
                    <div class="option_v8xK4z">
                        <label for="selectHideSubBadge">구독팬 배지 ❌</label>
                        <label class="switch_v8xK4z">
                            <input type="checkbox" id="selectHideSubBadge">
                            <span class="slider_v8xK4z round"></span>
                        </label>
                    </div>
                    <div class="option_v8xK4z">
                        <label for="selectHideVIPBadge">열혈팬 배지 ❌</label>
                        <label class="switch_v8xK4z">
                            <input type="checkbox" id="selectHideVIPBadge">
                            <span class="slider_v8xK4z round"></span>
                        </label>
                    </div>
                    <div class="option_v8xK4z">
                        <label for="selectHideMngrBadge">매니저 배지 ❌</label>
                        <label class="switch_v8xK4z">
                            <input type="checkbox" id="selectHideMngrBadge">
                            <span class="slider_v8xK4z round"></span>
                        </label>
                    </div>
                    <div class="option_v8xK4z">
                        <label for="selectHideStreamerBadge">스트리머 배지 ❌</label>
                        <label class="switch_v8xK4z">
                            <input type="checkbox" id="selectHideStreamerBadge">
                            <span class="slider_v8xK4z round"></span>
                        </label>
                    </div>
                    </div>

                    <div class="option_v8xK4z">
                        <label for="switchUnlockCopyPaste">[채팅 입력란] ✂️복사/붙여넣기 기능 복원</label>
                        <label class="switch_v8xK4z">
                            <input type="checkbox" id="switchUnlockCopyPaste">
                            <span class="slider_v8xK4z round"></span>
                        </label>
                    </div>
                    <div class="option_v8xK4z">
                        <label for="switchHideButtonsAboveChatInput">[채팅 입력란] 버튼 탭 ❌</label>
                        <label class="switch_v8xK4z">
                            <input type="checkbox" id="switchHideButtonsAboveChatInput">
                            <span class="slider_v8xK4z round"></span>
                        </label>
                    </div>
                    <div class="option_v8xK4z">
                        <label for="switchHideDuplicateChat">[💬메시지] 🌊물타기 채팅 차단 (중복 제거)<sup>3)</sup></label>
                        <label class="switch_v8xK4z">
                            <input type="checkbox" id="switchHideDuplicateChat">
                            <span class="slider_v8xK4z round"></span>
                        </label>
                    </div>
                    <div class="option_v8xK4z">
                        <label for="selectBlockWords">[💬메시지] 🔠단어로 🚫차단<sup>4)</sup></label>
                        <label class="switch_v8xK4z">
                            <input type="checkbox" id="selectBlockWords">
                            <span class="slider_v8xK4z round"></span>
                        </label>
                    </div>
                    <div class="option_v8xK4z" id="blockWordsInputContainer">
                        <textarea id="blockWordsInput" placeholder="콤마(,)로 구분하여 단어 입력" style="width: 100%; height: 38px; border: 1px solid #ccc;">${registeredWords}</textarea>
                    </div>

                    <div class="option_v8xK4z multi-option_v8xK4z">
                    <div class="option_v8xK4z">
                        <label for="switchShowSelectedMessages">[💬메시지] 채팅 💾모아보기 LIVE </label>
                        <label class="switch_v8xK4z">
                            <input type="checkbox" id="switchShowSelectedMessages">
                            <span class="slider_v8xK4z round"></span>
                        </label>
                    </div>
                    <div class="option_v8xK4z">
                        <label for="switchVODChatScan">[💬메시지] 채팅 💾모아보기 VOD</label>
                        <label class="switch_v8xK4z">
                            <input type="checkbox" id="switchVODChatScan">
                            <span class="slider_v8xK4z round"></span>
                        </label>
                    </div>
                    </div>

                    <div class="option_v8xK4z" id="selectedUsersInputContainer">
                        <textarea id="selectedUsersInput" placeholder="대상 유저 추가: 콤마(,)로 구분하여 유저 아이디 입력하세요 \n즐겨찾기는 자동 등록이므로 따로 입력할 필요 없음" style="width: 100%; height: 50px; border: 1px solid #ccc;">${selectedUsers}</textarea>
                    </div>
                    <div class="option_v8xK4z" id="switchCheckBestStreamersListContainer">
                        <label for="switchCheckBestStreamersList">[💬메시지] 모아보기에 베스트 스트리머 ${bestStreamersList.length}명 ➕추가<sup>5)</sup></label>
                        <label class="switch_v8xK4z">
                            <input type="checkbox" id="switchCheckBestStreamersList">
                            <span class="slider_v8xK4z round"></span>
                        </label>
                    </div>
                    <div class="option_v8xK4z">
                        <label for="switchShowDeletedMessages">[💬메시지] 💥강제퇴장 된 유저의 채팅 💾모아보기</label>
                        <label class="switch_v8xK4z">
                            <input type="checkbox" id="switchShowDeletedMessages">
                            <span class="slider_v8xK4z round"></span>
                        </label>
                    </div>
                    <div class="option_v8xK4z" id="switchChatCounterContainer">
                        <label for="switchChatCounter">[💬메시지] 초당 채팅 수 📊카운터 표시</label>
                        <label class="switch_v8xK4z">
                            <input type="checkbox" id="switchChatCounter">
                            <span class="slider_v8xK4z round"></span>
                        </label>
                    </div>

                    <div class="option_v8xK4z multi-option_v8xK4z">
                    <div class="option_v8xK4z">
                        <label for="switchExpandLiveChatArea">수직 모드 채팅창 ⛶ 확장 버튼 LIVE</label>
                        <label class="switch_v8xK4z">
                            <input type="checkbox" id="switchExpandLiveChatArea">
                            <span class="slider_v8xK4z round"></span>
                        </label>
                    </div>
                    <div class="option_v8xK4z">
                        <label for="switchExpandVODChatArea">수직 모드 채팅창 ⛶ 확장 버튼 VOD</label>
                        <label class="switch_v8xK4z">
                            <input type="checkbox" id="switchExpandVODChatArea">
                            <span class="slider_v8xK4z round"></span>
                        </label>
                    </div>
                    </div>

                </section>

                <div class="divider_v8xK4z"></div>

                <section>
                    <h3 id="recap-options-title" class="section-title_v8xK4z">리캡 옵션</h3>
                    <div class="option_v8xK4z">
                        <label for="switchMonthlyRecap">월별 📊리캡 활성화<sup>6)</sup></label>
                        <label class="switch_v8xK4z">
                            <input type="checkbox" id="switchMonthlyRecap">
                            <span class="slider_v8xK4z round"></span>
                        </label>
                    </div>
                </section>

                <div class="divider_v8xK4z"></div>

                <section>
                    <h3 id="etc-options-title" class="section-title_v8xK4z">기타 옵션</h3>
                    <div class="option_v8xK4z">
                        <label for="useInterFont">🟣트위치 폰트 (Inter)</label>
                        <label class="switch_v8xK4z">
                            <input type="checkbox" id="useInterFont">
                            <span class="slider_v8xK4z round"></span>
                        </label>
                    </div>
                </section>

                <footer class="modal-footer_v8xK4z">
                    <h3 id="management-title" class="section-title_v8xK4z">차단 관리 및 부가 설명</h3>
                    <p class="description_v8xK4z">⛔채널 차단: 본문 방송 목록 -> ⋮ 버튼 -> [이 브라우저에서 ... 숨기기]</p>
                    <p class="description_v8xK4z">⛔단어 등록/해제 및 차단 관리: Tampermonkey 아이콘을 눌러서 가능합니다.</p>
                    <p class="description_v8xK4z">✅카테고리 탭 등록/해제 및 차단 관리: Tampermonkey 아이콘을 눌러서 가능합니다.</p>
                    <div class="divider_v8xK4z"></div>
                    <p class="description_v8xK4z">1) MY 페이지에서 스트리머 고정 버튼(📌)을 누르면 사이드바에 고정이 됩니다.</p>
                    <p class="description_v8xK4z">2) 즐겨찾기 채널 중에서만 이동. 커스텀은 고정->알림->일반 순. 열린 탭 체크 후 이동.</p>
                    <p class="description_v8xK4z">3) 최근 10개 채팅 중에서 같은 내용을 차단합니다.</p>
                    <p class="description_v8xK4z">4) 해당 단어를 포함하는 메시지 숨김. 완전 일치 시 숨김은 단어 앞에 e:를 붙이기. <br>예) e:극,e:나,e:락,ㄱㅇㅇ,ㅔㅔ</p>
                    <p class="description_v8xK4z">5) 'SOOP (숲) - 현재 방송을 보고 있는 스트리머' 실행 필요. 없을 시 0명으로 나옵니다</p>
                    <p class="description_v8xK4z">6) 상단 바의 프로필 사진을 클릭하면 메뉴가 보입니다</p>

                    <p class="description_v8xK4z bug-report_v8xK4z">🐛버그 신고 혹은 수정 및 유용한 기능 추가 가능하신 능력자분이 계신다면 <a href="https://greasyfork.org/ko/scripts/551140" target="_blank">Greasy Fork</a>에서 확인 부탁드립니다.</p>
                </footer>
            </div>
        </div>
    </div>
</div>

`;

    // 3. 모달 기능 구현
    document.body.insertAdjacentHTML("beforeend", modalContentHTML);

    const modal = document.getElementById("myModal");

    if (modal) {
      let isFirstOpen = true;

      const closeModal = () => {
        modal.style.display = "none";
        document.body.style.overflow = "";
      };

      openModalBtn.addEventListener("click", () => {
        modal.style.display = "block";
        document.body.style.overflow = "hidden";

        if (isFirstOpen) {
          updateSettingsData();
          isFirstOpen = false;
        }
        populateOrderUI(); // 모달이 열릴 때마다 순서 UI 갱신
      });

      const closeBtn = modal.querySelector(".close-button_v8xK4z");
      if (closeBtn) {
        closeBtn.addEventListener("click", closeModal);
      }

      modal.addEventListener("click", (event) => {
        if (event.target === modal) {
          closeModal();
        }
      });

      window.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && modal.style.display === "block") {
          closeModal();
        }
      });

      // 인덱스 메뉴 및 스크롤 기능
      const indexButtons = modal.querySelectorAll(".index-button_v8xK4z");
      const optionsContainer = modal.querySelector(".modal-body_v8xK4z");
      const sectionTitles = modal.querySelectorAll(".section-title_v8xK4z");

      indexButtons.forEach((button) => {
        button.addEventListener("click", () => {
          const targetId = button.getAttribute("data-target-id");
          const targetElement = document.getElementById(targetId);
          if (targetElement && optionsContainer) {
            targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        });
      });
      // 현재 활성화된 버튼을 추적합니다.
      let currentActiveButton = null;

      const observer = new IntersectionObserver(
        (entries) => {
          // 활성화 영역에 들어온(isIntersecting) 모든 항목을 필터링합니다.
          const intersectingEntries = entries.filter((entry) => entry.isIntersecting);

          // 활성화 영역에 항목이 하나 이상 있는 경우
          if (intersectingEntries.length > 0) {
            // 가장 마지막에 들어온 항목을 선택합니다 (일반적으로 배열의 마지막 요소).
            const lastEntry = intersectingEntries[intersectingEntries.length - 1];
            const targetId = lastEntry.target.id;
            const newActiveButton = modal.querySelector(`.index-button_v8xK4z[data-target-id="${targetId}"]`);

            // 새로운 버튼이 있고, 현재 활성화된 버튼과 다른 경우에만 클래스를 변경합니다.
            if (newActiveButton && newActiveButton !== currentActiveButton) {
              // 이전에 활성화된 버튼이 있다면 'active' 클래스를 제거합니다.
              if (currentActiveButton) {
                currentActiveButton.classList.remove("active");
              }
              // 새로운 버튼에 'active' 클래스를 추가하고 현재 활성 버튼으로 설정합니다.
              newActiveButton.classList.add("active");
              currentActiveButton = newActiveButton;
            }
          }
        },
        {
          root: optionsContainer,
          // 활성화 영역을 컨테이너 상단 10%로 좁혀 더 정밀하게 만듭니다.
          rootMargin: "0px 0px -90% 0px",
          threshold: 0,
        },
      );

      sectionTitles.forEach((title) => {
        observer.observe(title);
      });
    }
  };
  const updateSettingsData = () => {
    const setCheckboxAndSaveValue = (elementId, storageVariable, storageKey) => {
      const checkbox = document.getElementById(elementId);

      // elementId가 유효한 경우에만 체크박스를 설정
      if (checkbox) {
        checkbox.checked = storageVariable === 1;

        checkbox.addEventListener("change", (event) => {
          GM_setValue(storageKey, event.target.checked ? 1 : 0);
          storageVariable = event.target.checked ? 1 : 0;
        });
      } else {
        customLog.warn(`Checkbox with id "${elementId}" not found.`);
      }
    };

    // 함수를 사용하여 각 체크박스를 설정하고 값을 저장합니다.
    setCheckboxAndSaveValue("fixFixedChannel", isPinnedStreamWithPinEnabled, "isPinnedStreamWithPinEnabled");
    setCheckboxAndSaveValue("fixNotificationChannel", isPinnedStreamWithNotificationEnabled, "isPinnedStreamWithNotificationEnabled");
    setCheckboxAndSaveValue("showBufferTime", isRemainingBufferTimeEnabled, "isRemainingBufferTimeEnabled");
    setCheckboxAndSaveValue("mutedInactiveTabs", isAutoChangeMuteEnabled, "isAutoChangeMuteEnabled");
    setCheckboxAndSaveValue("switchAutoChangeQuality", isAutoChangeQualityEnabled, "isAutoChangeQualityEnabled");
    setCheckboxAndSaveValue("switchNo1440p", isNo1440pEnabled, "isNo1440pEnabled");
    const qualitySelector = document.getElementById("qualitySelector");
    if (qualitySelector) {
      qualitySelector.value = targetQuality;
      qualitySelector.addEventListener("change", (e) => {
        targetQuality = e.target.value;
        GM_setValue("targetQuality", targetQuality);
      });
    }
    setCheckboxAndSaveValue("mpSortByViewers", myplusOrder, "myplusOrder");
    setCheckboxAndSaveValue("removeDuplicates", isDuplicateRemovalEnabled, "isDuplicateRemovalEnabled");
    setCheckboxAndSaveValue("openInNewTab", isOpenNewtabEnabled, "isOpenNewtabEnabled");
    setCheckboxAndSaveValue("openBackgroundTab", isOpenBackgroundTabEnabled, "isOpenBackgroundTabEnabled");
    setCheckboxAndSaveValue("mouseOverSideBar", showSidebarOnScreenMode, "showSidebarOnScreenMode");
    setCheckboxAndSaveValue("switchShowSidebarOnScreenModeAlways", showSidebarOnScreenModeAlways, "showSidebarOnScreenModeAlways");
    setCheckboxAndSaveValue("chatPosition", isBottomChatEnabled, "isBottomChatEnabled");
    setCheckboxAndSaveValue("showPauseButton", isMakePauseButtonEnabled, "isMakePauseButtonEnabled");
    setCheckboxAndSaveValue("switchCaptureButton", isCaptureButtonEnabled, "isCaptureButtonEnabled");
    setCheckboxAndSaveValue("switchSharpmodeShortcut", isMakeSharpModeShortcutEnabled, "isMakeSharpModeShortcutEnabled");
    setCheckboxAndSaveValue("switchLLShortcut", isMakeLowLatencyShortcutEnabled, "isMakeLowLatencyShortcutEnabled");
    setCheckboxAndSaveValue("switchQualityChangeShortcut", isMakeQualityChangeShortcutEnabled, "isMakeQualityChangeShortcutEnabled");
    setCheckboxAndSaveValue("sendLoadBroadCheck", isSendLoadBroadEnabled, "isSendLoadBroadEnabled");
    setCheckboxAndSaveValue("selectBestQuality", isSelectBestQualityEnabled, "isSelectBestQualityEnabled");
    setCheckboxAndSaveValue("selectHideSupporterBadge", isHideSupporterBadgeEnabled, "isHideSupporterBadgeEnabled");
    setCheckboxAndSaveValue("selectHideFanBadge", isHideFanBadgeEnabled, "isHideFanBadgeEnabled");
    setCheckboxAndSaveValue("selectHideSubBadge", isHideSubBadgeEnabled, "isHideSubBadgeEnabled");
    setCheckboxAndSaveValue("selectHideVIPBadge", isHideVIPBadgeEnabled, "isHideVIPBadgeEnabled");
    setCheckboxAndSaveValue("selectHideMngrBadge", isHideManagerBadgeEnabled, "isHideManagerBadgeEnabled");
    setCheckboxAndSaveValue("selectHideStreamerBadge", isHideStreamerBadgeEnabled, "isHideStreamerBadgeEnabled");
    setCheckboxAndSaveValue("selectBlockWords", isBlockWordsEnabled, "isBlockWordsEnabled");
    setCheckboxAndSaveValue("useInterFont", isChangeFontEnabled, "isChangeFontEnabled");
    setCheckboxAndSaveValue("autoClaimGem", isAutoClaimGemEnabled, "isAutoClaimGemEnabled");
    setCheckboxAndSaveValue("switchVideoSkipHandler", isVideoSkipHandlerEnabled, "isVideoSkipHandlerEnabled");
    setCheckboxAndSaveValue("switchSmallUserLayout", isSmallUserLayoutEnabled, "isSmallUserLayoutEnabled");
    setCheckboxAndSaveValue("switchChannelFeed", isChannelFeedEnabled, "isChannelFeedEnabled");
    setCheckboxAndSaveValue("switchCustomSidebar", isCustomSidebarEnabled, "isCustomSidebarEnabled");
    setCheckboxAndSaveValue("switchRemoveCarousel", isRemoveCarouselEnabled, "isRemoveCarouselEnabled");
    setCheckboxAndSaveValue("switchDocumentTitleUpdate", isDocumentTitleUpdateEnabled, "isDocumentTitleUpdateEnabled");
    setCheckboxAndSaveValue("switchRemoveRedistributionTag", isRemoveRedistributionTagEnabled, "isRemoveRedistributionTagEnabled");
    setCheckboxAndSaveValue("switchRemoveWatchLaterButton", isRemoveWatchLaterButtonEnabled, "isRemoveWatchLaterButtonEnabled");
    setCheckboxAndSaveValue("switchBroadTitleTextEllipsis", isBroadTitleTextEllipsisEnabled, "isBroadTitleTextEllipsisEnabled");
    setCheckboxAndSaveValue("switchRemoveBroadStartTimeTag", isRemoveBroadStartTimeTagEnabled, "isRemoveBroadStartTimeTagEnabled");
    setCheckboxAndSaveValue("switchUnlockCopyPaste", isUnlockCopyPasteEnabled, "isUnlockCopyPasteEnabled");
    setCheckboxAndSaveValue("switchAlignNicknameRight", isAlignNicknameRightEnabled, "isAlignNicknameRightEnabled");
    setCheckboxAndSaveValue("switchPreviewModal", isPreviewModalEnabled, "isPreviewModalEnabled");
    setCheckboxAndSaveValue("switchPreviewModalRightClick", isPreviewModalRightClickEnabled, "isPreviewModalRightClickEnabled");
    setCheckboxAndSaveValue("switchPreviewModalFromSidebar", isPreviewModalFromSidebarEnabled, "isPreviewModalFromSidebarEnabled");
    setCheckboxAndSaveValue("switchReplaceEmptyThumbnail", isReplaceEmptyThumbnailEnabled, "isReplaceEmptyThumbnailEnabled");
    setCheckboxAndSaveValue("switchAutoScreenMode", isAutoScreenModeEnabled, "isAutoScreenModeEnabled");
    setCheckboxAndSaveValue("switchAdjustDelayNoGrid", isAdjustDelayNoGridEnabled, "isAdjustDelayNoGridEnabled");
    setCheckboxAndSaveValue("switchHideButtonsAboveChatInput", ishideButtonsAboveChatInputEnabled, "ishideButtonsAboveChatInputEnabled");
    setCheckboxAndSaveValue("switchExpandVODChatArea", isExpandVODChatAreaEnabled, "isExpandVODChatAreaEnabled");
    setCheckboxAndSaveValue("switchExpandLiveChatArea", isExpandLiveChatAreaEnabled, "isExpandLiveChatAreaEnabled");
    setCheckboxAndSaveValue("switchRemoveShadowsFromCatch", isRemoveShadowsFromCatchEnabled, "isRemoveShadowsFromCatchEnabled");
    setCheckboxAndSaveValue("switchShowSelectedMessages", isShowSelectedMessagesEnabled, "isShowSelectedMessagesEnabled");
    setCheckboxAndSaveValue("switchShowDeletedMessages", isShowDeletedMessagesEnabled, "isShowDeletedMessagesEnabled");
    setCheckboxAndSaveValue("switchNoAutoVOD", isNoAutoVODEnabled, "isNoAutoVODEnabled");
    setCheckboxAndSaveValue("switchRedirectLive", isRedirectLiveEnabled, "isRedirectLiveEnabled");
    setCheckboxAndSaveValue("switchHideEsportsInfo", isHideEsportsInfoEnabled, "isHideEsportsInfoEnabled");
    setCheckboxAndSaveValue("switchBlockedCategorySorting", isBlockedCategorySortingEnabled, "isBlockedCategorySortingEnabled");
    setCheckboxAndSaveValue("switchChatCounter", isChatCounterEnabled, "isChatCounterEnabled");
    setCheckboxAndSaveValue("switchRandomSort", isRandomSortEnabled, "isRandomSortEnabled");
    setCheckboxAndSaveValue("switchPinnedOnlineOnly", isPinnedOnlineOnlyEnabled, "isPinnedOnlineOnlyEnabled");
    setCheckboxAndSaveValue("switchMonthlyRecap", isMonthlyRecapEnabled, "isMonthlyRecapEnabled");
    setCheckboxAndSaveValue("switchClickToMute", isClickToMuteEnabled, "isClickToMuteEnabled");
    setCheckboxAndSaveValue("switchVODChatScan", isVODChatScanEnabled, "isVODChatScanEnabled");
    setCheckboxAndSaveValue("switchVODHighlight", isVODHighlightEnabled, "isVODHighlightEnabled");
    setCheckboxAndSaveValue("switchCheckBestStreamersList", isCheckBestStreamersListEnabled, "isCheckBestStreamersListEnabled");
    setCheckboxAndSaveValue("switchClickPlayerEventMapper", isClickPlayerEventMapperEnabled, "isClickPlayerEventMapperEnabled");
    setCheckboxAndSaveValue("switchFavoriteGroups", isFavoriteGroupEnabled, "isFavoriteGroupEnabled");
    setCheckboxAndSaveValue("switchCategoryGroups", isCategoryGroupEnabled, "isCategoryGroupEnabled");
    setCheckboxAndSaveValue("switchShortenFavoriteGroupName", isShortenFavoriteGroupNameEnabled, "isShortenFavoriteGroupNameEnabled");
    setCheckboxAndSaveValue("switchShortenCategoryName", isShortenCategoryNameEnabled, "isShortenCategoryNameEnabled");
    setCheckboxAndSaveValue("switchPlayerAdvancedControlsLive", isPlayerAdvancedControlsLiveEnabled, "isPlayerAdvancedControlsLiveEnabled");
    setCheckboxAndSaveValue("switchPlayerAdvancedControlsVOD", isPlayerAdvancedControlsVODEnabled, "isPlayerAdvancedControlsVODEnabled");
    setCheckboxAndSaveValue("switchPlayerPanzoom", isPlayerPanzoomEnabled, "isPlayerPanzoomEnabled");
    setCheckboxAndSaveValue("switchPlayerPanzoomVOD", isPlayerPanzoomVODEnabled, "isPlayerPanzoomVODEnabled");
    setCheckboxAndSaveValue("switchHideDuplicateChat", isHideDuplicateChatEnabled, "isHideDuplicateChatEnabled");

    const handleRangeInput = (inputId, displayId, currentValue, storageKey) => {
      const input = document.getElementById(inputId);
      input.value = currentValue;

      input.addEventListener("input", (event) => {
        const newValue = parseInt(event.target.value); // event.target.value로 변경
        if (newValue !== currentValue) {
          GM_setValue(storageKey, newValue);
          currentValue = newValue;
          document.getElementById(displayId).textContent = newValue;
          if (inputId === "nicknameWidthDisplay") setWidthNickname(newValue);
        }
      });
    };

    handleRangeInput("favoriteChannelsDisplay", "favoriteChannelsDisplayValue", displayFollow, "displayFollow");
    handleRangeInput("myPlusChannelsDisplay", "myPlusChannelsDisplayValue", displayMyplus, "displayMyplus");
    handleRangeInput("myPlusVODDisplay", "myPlusVODDisplayValue", displayMyplusvod, "displayMyplusvod");
    handleRangeInput("popularChannelsDisplay", "popularChannelsDisplayValue", displayTop, "displayTop");
    handleRangeInput("nicknameWidthDisplay", "nicknameWidthDisplayValue", nicknameWidth, "nicknameWidth");

    // 채팅 단어 차단 입력 상자 설정
    const blockWordsInputBox = document.getElementById("blockWordsInput");

    blockWordsInputBox.addEventListener("input", () => {
      const inputValue = blockWordsInputBox.value.trim();
      registeredWords = inputValue;
      GM_setValue("registeredWords", inputValue);
    });

    // 유저 채팅 모아보기 입력 상자 설정
    const selectedUsersinputBox = document.getElementById("selectedUsersInput");

    selectedUsersinputBox.addEventListener("input", () => {
      const inputValue = selectedUsersinputBox.value.trim();
      selectedUsers = inputValue;
      GM_setValue("selectedUsers", inputValue);
    });

    // 1. Select 메뉴를 위한 새로운 헬퍼 함수를 정의합니다.
    const setSelectAndSaveValue = (elementId, storageKey, defaultValue) => {
      const select = document.getElementById(elementId);
      if (select) {
        // Greasemonkey에 저장된 값을 불러와 select 메뉴의 초기 값을 설정합니다.
        select.value = GM_getValue(storageKey, defaultValue);

        // select 메뉴의 값이 변경될 때마다 새로운 값을 저장합니다.
        select.addEventListener("change", (event) => {
          GM_setValue(storageKey, event.target.value);
        });
      } else {
        customLog.warn(`Select element with id "${elementId}" not found.`);
      }
    };

    // 2. 새로 만든 헬퍼 함수를 사용하여 각 Select 메뉴를 설정합니다.
    setSelectAndSaveValue("selectLeftClick", "livePlayerLeftClickFunction", "toggleMute");
    setSelectAndSaveValue("selectRightClick", "livePlayerRightClickFunction", "toggleScreenMode");

    setSelectAndSaveValue("redirectLiveSortOption", "redirectLiveSortOption", "custom");

    // 하위 옵션 숨기기
    setupDependentVisibility({
      controllers: [document.getElementById("switchNoAutoVOD")],
      targets: [document.getElementById("redirectLiveOptionContainer")],
    });

    setupDependentVisibility({
      controllers: [document.getElementById("switchPreviewModal")],
      targets: [document.getElementById("switchPreviewModalRightClickContainer")],
    });

    setupDependentVisibility({
      controllers: [document.getElementById("selectBlockWords")],
      targets: [document.getElementById("blockWordsInputContainer")],
    });

    setupDependentVisibility({
      controllers: [document.getElementById("switchHideDuplicateChat"), document.getElementById("switchShowSelectedMessages"), document.getElementById("switchVODChatScan")],
      targets: [document.getElementById("selectedUsersInputContainer"), document.getElementById("switchCheckBestStreamersListContainer"), document.getElementById("switchChatCounterContainer")],
    });

    setupDependentVisibility({
      controllers: [document.getElementById("switchCustomSidebar")],
      targets: [...document.querySelectorAll(".customSidebarOptionsContainer")],
    });
  };
  const openHlsStream = (nickname, m3u8Url) => {
    // HTML과 JavaScript 코드 생성
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${nickname}</title>
  <style>
    body {
        background-color: black;
        margin: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        overflow: hidden;
        position: relative;  /* 자식 요소 위치 조정을 위해 추가 */
    }
    #video {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        margin: auto;
        max-height: 100%;
        max-width: 100%;
    }
    #overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);  /* 반투명 배경 */
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 5;  /* 비디오보다 위에 보이도록 설정 */
    }
    #muteButton {
        background-color: rgba(255, 255, 255, 0.8);
        border: none;
        border-radius: 50%;
        padding: 30px;  /* 버튼 크기 증가 */
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 36px;  /* 아이콘 크기 증가 */
        z-index: 10;  /* 버튼이 다른 요소 위에 보이도록 설정 */
    }
  </style>
  <script src="https://cdn.jsdelivr.net/npm/hls.js@latest"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
</head>
<body>
  <video id="video" controls autoplay muted></video>
  <div id="overlay">
    <button id="muteButton"><i class="fas fa-volume-mute"></i></button>
  </div>
  <script>
    const video = document.getElementById("video");
    const muteButton = document.getElementById("muteButton");
    const overlay = document.getElementById("overlay");

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource("${m3u8Url}");
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, function () {
        video.play();
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = "${m3u8Url}";
      video.addEventListener("loadedmetadata", function () {
        video.play();
      });
    }

    const toggleMute = () => {
      video.muted = !video.muted;
      muteButton.innerHTML = video.muted ? '<i class="fas fa-volume-mute"></i>' : '<i class="fas fa-volume-up"></i>';
      overlay.style.display = 'none';  // 버튼 클릭 후 레이어 사라지도록 설정
    };

    // 버튼 클릭 시 음소거 해제
    muteButton.addEventListener("click", (event) => {
      event.stopPropagation(); // 클릭 이벤트 전파 방지
      toggleMute();
    });

    // 문서의 아무 곳을 클릭해도 음소거 해제
    overlay.addEventListener("click", toggleMute);
  </script>
</body>
</html>
    `;

    // Blob 생성
    const blob = new Blob([htmlContent], { type: "text/html" });
    const blobUrl = URL.createObjectURL(blob);

    // 새로운 창으로 Blob URL 열기
    window.open(blobUrl, "_blank");
  };
  unsafeWindow.openHlsStream = openHlsStream;

  const captureLatestFrame = (videoElement) => {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      // 캔버스 크기 설정 (480x270)
      const canvasWidth = 480;
      const canvasHeight = 270;
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;

      // 원본 비디오의 비율을 유지하면서 크기 계산
      const videoRatio = videoElement.videoWidth / videoElement.videoHeight;
      const canvasRatio = canvasWidth / canvasHeight;

      let drawWidth, drawHeight;
      let offsetX = 0,
        offsetY = 0;

      if (videoRatio > canvasRatio) {
        drawWidth = canvasWidth;
        drawHeight = canvasWidth / videoRatio;
        offsetY = (canvasHeight - drawHeight) / 2;
      } else {
        drawHeight = canvasHeight;
        drawWidth = canvasHeight * videoRatio;
        offsetX = (canvasWidth - drawWidth) / 2;
      }

      // 배경을 검은색으로 채우기
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      // 비디오의 현재 프레임을 캔버스에 그림
      ctx.drawImage(videoElement, offsetX, offsetY, drawWidth, drawHeight);

      // webp 형식으로 변환 후 반환
      const dataURL = canvas.toDataURL("image/webp");
      resolve(dataURL); // 데이터 URL 반환
    });
  };

  function replaceThumbnails() {
    // 1. 화면 내 '연령제한' 배지들을 모두 찾음
    const adultBadges = document.querySelectorAll(".status.adult");

    adultBadges.forEach((badge) => {
      // 2. 배지가 속한 박스(.thumbs-box) 찾기
      const container = badge.closest(".thumbs-box");
      if (!container) return;

      const link = container.querySelector("a");
      const img = link ? link.querySelector("img") : null;

      // 유효성 검사 & 이미 이벤트를 붙였는지 확인 (중복 방지)
      if (!link || !img || link.dataset.mouseEventAttached === "true") return;

      // 3. "이벤트 리스너를 붙였다"는 표시를 남김
      link.dataset.mouseEventAttached = "true";

      // 4. [핵심] 마우스가 올라갔을 때(mouseenter) 실행될 동작 정의
      link.addEventListener("mouseenter", async () => {
        // 이미 이미지를 로드해서 바꿨다면 다시 실행하지 않음
        if (link.dataset.imageLoaded === "true") return;

        // 링크에서 아이디와 방송번호 추출
        const href = link.getAttribute("href");
        const matches = href && href.match(/play\.sooplive\.co\.kr\/([^/]+)\/(\d+)/);

        if (matches) {
          const broadcasterId = matches[1];
          const broadNo = matches[2];

          // (선택사항) 로딩 중임을 알리기 위해 투명도 조절
          // img.style.opacity = '0.6';

          try {
            // 방송 이미지 데이터 가져오기
            const frameData = await getLatestFrameData(broadcasterId, broadNo);

            if (frameData) {
              img.src = frameData;
              img.style.objectFit = "cover";
              // (선택사항) 투명도 원상복구
              // img.style.opacity = '1';

              // 성공적으로 바꿨음을 표시 (다시 마우스 올려도 로드 안 함)
              link.dataset.imageLoaded = "true";
            }
          } catch (err) {
            console.error("썸네일 로드 실패:", err);
          }
        }
      });
    });
  }

  /**
   * =================================================================
   * 프리뷰 모달 클래스 (PreviewModal Class)
   * 모달 관련 모든 기능(생성, 열기, 닫기, 이벤트 연결 등)을 캡슐화합니다.
   * =================================================================
   */
  class PreviewModal {
    /**
     * PreviewModal 클래스의 생성자
     */
    constructor() {
      this.elements = null;

      this.isOpenNewtabEnabled = isOpenNewtabEnabled; // '참여하기' 버튼 클릭 시 새 탭에서 열지 여부
      this.isPreviewModalRightClickEnabled = isPreviewModalRightClickEnabled; // 우클릭으로 미리보기 열기 기능 사용 여부

      this.hls = null;
    }

    /**
     * [내부 메서드] 모달에 필요한 DOM 요소를 생성하고 body에 추가합니다.
     * 이 메서드는 모달이 처음 열릴 때 한 번만 호출됩니다.
     */
    _createModal() {
      const modal = document.createElement("div");
      modal.className = "preview-modal";

      const modalContent = document.createElement("div");
      modalContent.className = "preview-modal-content";

      const closeButton = document.createElement("span");
      closeButton.className = "preview-close";
      closeButton.innerHTML = "&times;";

      const videoPlayer = document.createElement("video");
      videoPlayer.controls = true;

      const infoContainer = document.createElement("div");
      infoContainer.className = "info";

      const streamerName = document.createElement("div");
      streamerName.className = "streamer-name";

      const videoTitle = document.createElement("div");
      videoTitle.className = "video-title";

      const tagsContainer = document.createElement("div");
      tagsContainer.className = "tags";

      const startButton = document.createElement("a");
      startButton.className = "start-button";
      startButton.textContent = "참여하기 >";

      infoContainer.append(streamerName, tagsContainer, videoTitle, startButton);
      modalContent.append(closeButton, videoPlayer, infoContainer);
      modal.appendChild(modalContent);
      document.body.appendChild(modal);

      // 생성된 요소들을 클래스의 elements 속성에 저장합니다.
      this.elements = { modal, videoPlayer, streamerName, videoTitle, tagsContainer, startButton };

      // 이벤트 핸들러를 연결합니다. 'this'가 클래스 인스턴스를 가리키도록 화살표 함수를 사용합니다.
      closeButton.onclick = () => this.close();
      startButton.onclick = () => {
        setTimeout(() => this.close(), 1000);
      };
      window.onclick = (event) => {
        if (event.target === this.elements.modal) {
          this.close();
        }
      };
    }

    /**
     * 모달을 닫고 비디오 재생을 중지합니다.
     */
    close() {
      if (!this.elements) return; // 모달이 생성되지 않았으면 아무것도 하지 않음

      this.elements.modal.style.display = "none";
      this.elements.videoPlayer.pause();
      this.elements.videoPlayer.src = "";

      // HLS 인스턴스가 있으면 파괴하여 메모리 누수를 방지합니다.
      if (this.hls) {
        this.hls.destroy();
        this.hls = null;
      }
    }

    /**
     * [핵심] 방송 데이터를 기반으로 미리보기 모달을 엽니다.
     * @param {object} data - { id, broadNumber, streamerName, videoTitle, tags }
     */
    async open(data) {
      // 모달 DOM이 아직 생성되지 않았다면, 이 시점에서 생성합니다.
      if (!this.elements) {
        this._createModal();
      }

      // 모달이 이미 열려있으면 중단
      if (this.elements.modal.style.display === "block") {
        return;
      }

      // 필수 데이터 확인
      if (!data.id || !data.broadNumber) {
        customLog.error("미리보기를 위한 필수 정보(id, broadNumber)가 부족합니다.");
        return;
      }

      const playerLink = `https://play.sooplive.co.kr/${data.id}/${data.broadNumber}`;

      try {
        // `getM3u8url`은 외부에 정의된 함수라고 가정합니다.
        const m3u8url = await getM3u8url(data.id, data.broadNumber, "hd");

        const modalData = { ...data, m3u8url, playerLink };

        this._updateContent(modalData); // 모달 내용 업데이트
        this.elements.modal.style.display = "block"; // 모달 보이기
      } catch (error) {
        customLog.error("방송 정보를 가져오는 데 실패했습니다:", error);
        // 에러 발생 시 참여하기 버튼이라도 활성화되도록 처리할 수 있습니다.
        const errorData = { ...data, m3u8url: null, playerLink };
        this._updateContent(errorData);
        this.elements.modal.style.display = "block";
      }
    }

    /**
     * [내부 메서드] 받은 데이터를 기반으로 모달의 내용을 업데이트합니다.
     * @param {object} data - 모달에 표시할 모든 정보
     */
    _updateContent(data) {
      const { videoPlayer, streamerName, videoTitle, tagsContainer, startButton } = this.elements;
      const { m3u8url, playerLink, streamerName: name, videoTitle: title, tags } = data;

      const hrefTarget = this.isOpenNewtabEnabled ? "_blank" : "_self";

      streamerName.textContent = name;
      videoTitle.textContent = title;
      this._updateTags(tagsContainer, tags);

      startButton.setAttribute("href", playerLink);
      startButton.setAttribute("target", hrefTarget);

      // 비디오 플레이어 설정
      if (m3u8url) {
        this._setupVideoPlayer(videoPlayer, m3u8url);
      } else {
        // M3U8 주소를 가져오지 못한 경우 비디오 플레이어를 숨김 처리할 수 있습니다.
        videoPlayer.style.display = "none";
      }
    }

    /**
     * [내부 메서드] 태그 목록을 업데이트합니다.
     * @param {HTMLElement} tagsContainer - 태그가 표시될 부모 요소
     * @param {Array<object>} tags - 태그 정보 배열 [{ text, href }]
     */
    _updateTags(tagsContainer, tags = []) {
      tagsContainer.innerHTML = ""; // 이전 태그 모두 제거
      tags.forEach((tag) => {
        const tagElement = document.createElement("a");
        tagElement.textContent = tag.text;
        tagElement.href = tag.href;
        tagsContainer.appendChild(tagElement);
      });
    }

    /**
     * [내부 메서드] HLS.js를 사용하여 비디오 플레이어를 설정하고 재생합니다.
     * @param {HTMLVideoElement} videoPlayer - 비디오 플레이어 요소
     * @param {string} m3u8url - 재생할 M3U8 주소
     */
    _setupVideoPlayer(videoPlayer, m3u8url) {
      const playVideo = () => {
        const savedVolume = localStorage.getItem("videoPlayerVolume");
        videoPlayer.volume = savedVolume !== null ? parseFloat(savedVolume) : 0.5;
        videoPlayer.style.display = "block";
        videoPlayer.play();
      };

      videoPlayer.onvolumechange = () => {
        localStorage.setItem("videoPlayerVolume", videoPlayer.volume);
      };

      if (unsafeWindow.Hls.isSupported()) {
        // 이전 HLS 인스턴스가 있다면 파괴
        if (this.hls) {
          this.hls.destroy();
        }
        this.hls = new unsafeWindow.Hls();
        this.hls.loadSource(m3u8url);
        this.hls.attachMedia(videoPlayer);
        this.hls.on(unsafeWindow.Hls.Events.MANIFEST_PARSED, playVideo);
      } else if (videoPlayer.canPlayType("application/vnd.apple.mpegurl")) {
        videoPlayer.src = m3u8url;
        videoPlayer.addEventListener("loadedmetadata", playVideo, { once: true }); // 이벤트가 한 번만 실행되도록 설정
      } else {
        alert("이 브라우저는 HLS 비디오를 지원하지 않습니다.");
      }
    }

    /**
     * 썸네일 링크 목록에 미리보기 이벤트 리스너를 추가합니다.
     * @param {NodeListOf<Element>} thumbsBoxLinks - 썸네일 링크 요소 목록
     */
    attachToThumbnails(thumbsBoxLinks) {
      for (const thumbsBoxLink of thumbsBoxLinks) {
        if (thumbsBoxLink.classList.contains("preview-checked")) continue;
        thumbsBoxLink.classList.add("preview-checked");

        const hrefValue = thumbsBoxLink.getAttribute("href");
        if (!hrefValue?.includes("play.sooplive.co.kr")) continue;

        const eventType = this.isPreviewModalRightClickEnabled ? "contextmenu" : "click";

        thumbsBoxLink.addEventListener(eventType, async (event) => {
          event.preventDefault();
          event.stopPropagation();

          const [, , , id, broadNumber] = hrefValue.split("/");
          const parent = thumbsBoxLink.parentNode.parentNode;
          const streamerName = parent.querySelector(".nick").innerText;
          const videoTitle = parent.querySelector(".title a").innerText;
          const tagNodes = parent.querySelectorAll(".tag_wrap a");

          const tags = Array.from(tagNodes).map((tag) => ({
            text: tag.innerText,
            href: tag.getAttribute("class") === "category" ? `https://www.sooplive.co.kr/directory/category/${encodeURIComponent(tag.innerText)}/live` : `https://www.sooplive.co.kr/search?hash=hashtag&tagname=${encodeURIComponent(tag.innerText)}&hashtype=live&stype=hash&acttype=live&location=live_main&inflow_tab=`,
          }));

          const broadcastData = { id, broadNumber, streamerName, videoTitle, tags };
          await this.open(broadcastData); // 클래스의 open 메서드 호출
        });
      }
    }

    /**
     * 사이드바 링크의 oncontextmenu 속성에서 호출될 헬퍼 함수
     * @param {HTMLElement} element - 우클릭된 <a> 요소
     * @param {Event} event - contextmenu 이벤트 객체
     */
    async handleSidebarContextMenu(element, event) {
      event.preventDefault();
      event.stopPropagation();

      const href = element.getAttribute("href");
      const parts = href.split("/");
      const id = element.dataset.userId || parts[3];
      const broadNumber = parts[4];

      if (!id || !broadNumber) {
        customLog.error("ID 또는 방송 번호를 추출할 수 없습니다.", element);
        return;
      }

      const streamerName = element.querySelector(".username")?.innerText || id;
      const videoTitle = element.getAttribute("tooltip") || element.querySelector(".description")?.innerText;
      const categorySpan = element.querySelector(".description");

      const tags = [];
      if (categorySpan) {
        const categoryText = categorySpan.innerText;
        tags.push({
          text: categoryText,
          href: `https://www.sooplive.co.kr/directory/category/${encodeURIComponent(categoryText)}/live`,
        });
      }

      const broadcastData = { id, broadNumber, streamerName, videoTitle, tags };
      await this.open(broadcastData);
    }
  }

  const removeUnwantedTags = () => {
    if (isRemoveCarouselEnabled) {
      GM_addStyle(`
                div[class^="player_player_wrap"] {
                    display: none !important;
                }
            `);
    }

    if (isRemoveRedistributionTagEnabled) {
      GM_addStyle(`
                [data-type=cBox] .thumbs-box .allow {
                    display: none !important;
                }
            `);
    }

    if (isRemoveWatchLaterButtonEnabled) {
      GM_addStyle(`
                [data-type=cBox] .thumbs-box .later {
                    display: none !important;
                }
            `);
    }

    if (isRemoveBroadStartTimeTagEnabled) {
      GM_addStyle(`
                [data-type=cBox] .thumbs-box .time {
                    display: none !important;
                }
            `);
    }

    if (isBroadTitleTextEllipsisEnabled) {
      GM_addStyle(`
                [data-type=cBox] .cBox-info .title a {
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    display: inline-block;
                }
            `);
    }
  };
  const appendPauseButton = async () => {
    try {
      // 기존 버튼이 있다면 제거
      const existingButton = document.body.querySelector("#closeStream");
      if (existingButton) {
        existingButton.remove();
      }

      // time_shift_play 버튼이 숨겨져 있을 때만 버튼 생성
      const timeShiftButton = await waitForElementAsync("button#time_shift_play");
      if (window.getComputedStyle(timeShiftButton).display !== "none") return;

      const ctrlDiv = document.body.querySelector("div.ctrl");
      if (!ctrlDiv) return;

      const newCloseStreamButton = document.createElement("button");
      newCloseStreamButton.type = "button";
      newCloseStreamButton.id = "closeStream";
      newCloseStreamButton.className = "pause on";

      const tooltipDiv = document.createElement("div");
      tooltipDiv.className = "tooltip";
      const spanElement = document.createElement("span");
      spanElement.textContent = "일시정지";

      tooltipDiv.appendChild(spanElement);
      newCloseStreamButton.appendChild(tooltipDiv);
      ctrlDiv.insertBefore(newCloseStreamButton, ctrlDiv.firstChild);

      newCloseStreamButton.addEventListener("click", (e) => {
        e.preventDefault();
        toggleStream(newCloseStreamButton, spanElement);
      });
    } catch (error) {
      customLog.error("스트리밍 종료 버튼 생성 실패:", error);
    }
  };

  const toggleStream = (button, spanElement) => {
    try {
      if (button.classList.contains("on")) {
        unsafeWindow.livePlayer.closeStreamConnector();
        button.classList.remove("on", "pause");
        button.classList.add("off", "play");
        spanElement.textContent = "재생";
      } else {
        unsafeWindow.livePlayer._startBroad();
        button.classList.remove("off", "play");
        button.classList.add("on", "pause");
        spanElement.textContent = "일시정지";
      }
    } catch (error) {
      customLog.log(error);
    }
  };
  const setWidthNickname = (wpx) => {
    if (typeof wpx === "number" && wpx > 0) {
      // wpx가 유효한 값인지 확인
      GM_addStyle(`
            .starting-line .chatting-list-item .message-container .username {
                width: ${wpx}px !important;
            }
        `);
    } else {
      customLog.warn("Invalid width value provided for setWidthNickname."); // 유효하지 않은 값 경고
    }
  };
  const hideBadges = () => {
    const badgeSettings = [
      { key: "isHideSupporterBadgeEnabled", className: "support" },
      { key: "isHideFanBadgeEnabled", className: "fan" },
      { key: "isHideSubBadgeEnabled", className: "sub" },
      { key: "isHideVIPBadgeEnabled", className: "vip" },
      { key: "isHideManagerBadgeEnabled", className: "manager" },
      { key: "isHideStreamerBadgeEnabled", className: "streamer" },
    ];

    // 각 배지 숨김 설정 값 가져오기
    const settings = badgeSettings.map((setting) => ({
      key: setting.key,
      enabled: GM_getValue(setting.key),
      className: setting.className,
    }));

    // 모든 배지 숨김 설정이 비활성화된 경우 종료
    if (!settings.some((setting) => setting.enabled)) {
      return;
    }

    // 활성화된 설정에 대한 CSS 규칙 생성
    let cssRules = settings
      .filter((setting) => setting.enabled)
      .map((setting) => `[class^="grade-badge-${setting.className}"] { display: none !important; }`)
      .join("\n");

    // 서브 배지용 CSS 규칙 추가
    if (settings.find((s) => s.className === "sub" && s.enabled)) {
      const thumbSpanSelector = CURRENT_URL.startsWith("https://play.sooplive.co.kr/") ? "#chat_area div.username > button > span.thumb" : "#chatMemo div.username > button > span.thumb";
      cssRules += `\n${thumbSpanSelector} { display: none !important; }`;
    }

    // CSS 규칙 한 번만 적용
    GM_addStyle(cssRules);
  };
  const unlockCopyPaste = (targetDiv) => {
    const writeArea = document.getElementById("write_area");

    // 복사 기능
    const handleCopy = (event) => {
      event.preventDefault(); // 기본 복사 동작 막기
      const selectedText = window.getSelection().toString(); // 선택된 텍스트 가져오기
      if (selectedText) {
        event.clipboardData.setData("text/plain", selectedText); // 클립보드에 텍스트 쓰기
      }
    };

    // 잘라내기 기능
    const handleCut = (event) => {
      event.preventDefault(); // 기본 잘라내기 동작 막기
      const selectedText = window.getSelection().toString(); // 선택된 텍스트 가져오기
      if (selectedText) {
        event.clipboardData.setData("text/plain", selectedText); // 클립보드에 텍스트 쓰기
        document.execCommand("delete"); // 선택된 텍스트 삭제
      }
    };

    // 붙여넣기 기능
    const handlePaste = (event) => {
      event.preventDefault(); // 기본 붙여넣기 동작 막기
      const text = (event.clipboardData || window.clipboardData).getData("text"); // 클립보드에서 텍스트 가져오기
      document.execCommand("insertText", false, text); // 텍스트를 수동으로 삽입
    };

    // 이벤트 리스너 등록
    writeArea.addEventListener("copy", handleCopy);
    writeArea.addEventListener("cut", handleCut);
    writeArea.addEventListener("paste", handlePaste);
  };
  const alignNicknameRight = () => {
    GM_addStyle(`
        .starting-line .chatting-list-item .message-container .username > button {
            float: right !important;
            white-space: nowrap;
        }
        `);
  };
  const hideButtonsAboveChatInput = () => {
    const style = `
        .chatbox .actionbox .chat_item_list {
            display: none !important;
        }
        .chatbox .actionbox {
            height: auto !important;
        }
        `;
    GM_addStyle(style);
  };
  const addStyleExpandLiveChat = () => {
    const style = `
        body.expandLiveChat:not(.screen_mode,.fullScreen_mode) #serviceHeader,
        body.expandLiveChat:not(.screen_mode,.fullScreen_mode) .broadcast_information,
        body.expandLiveChat:not(.screen_mode,.fullScreen_mode) .section_selectTab,
        body.expandLiveChat:not(.screen_mode,.fullScreen_mode) .wrapping.player_bottom{
            display: none !important;
        }

        body.expandLiveChat:not(.screen_mode,.fullScreen_mode) #webplayer_contents,
        body.expandLiveChat:not(.screen_mode,.fullScreen_mode) #sidebar {
            top: 0 !important;
            margin-top: 0 !important;
            min-height: 100vh !important;
        }

        body.expandLiveChat:not(.screen_mode,.fullScreen_mode) #webplayer #webplayer_contents .wrapping.side {
            padding: 0 !important;
        }
        `;
    GM_addStyle(style);
  };
  const makeExpandChatButton = (el, css_class) => {
    if (!el) return;

    // li 요소 생성
    const li = document.createElement("li");
    li.className = "expand-toggle-li";

    // a 요소 생성
    const a = document.createElement("a");
    a.href = "javascript:;";
    a.setAttribute("tip", "확장/축소(x)");
    a.textContent = "확장/축소(x)";

    // 클릭 이벤트 등록 (a에 등록해도 되고 li에 등록해도 됨)
    a.addEventListener("click", () => {
      document.body.classList.toggle(css_class);
    });

    // li에 a 추가, 그리고 el에 li 추가
    li.appendChild(a);
    el.appendChild(li);
  };
  const makeCaptureButton = () => {
    const svgDataUrl = "data:image/svg+xml,%3Csvg%20width%3D%2264%22%20height%3D%2264%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20stroke%3D%22%23fff%22%3E%3Cg%20stroke-width%3D%220%22%2F%3E%3Cg%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke%3D%22%23CCC%22%20stroke-width%3D%22.048%22%2F%3E%3Cg%20stroke-width%3D%221.488%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M21%2013c0-2.667-.5-5-1-5.333-.32-.214-1.873-.428-4-.553C14.808%207.043%2017%205%2012%205S9.192%207.043%208%207.114c-2.127.125-3.68.339-4%20.553C3.5%208%203%2010.333%203%2013s.5%205%201%205.333S8%2019%2012%2019s7.5-.333%208-.667c.5-.333%201-2.666%201-5.333%22%2F%3E%3Cpath%20d%3D%22M12%2016a3%203%200%201%200%200-6%203%203%200%200%200%200%206%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E";

    // 1. CSS 삽입
    const style = document.createElement("style");
    style.textContent = `
    #player .imageCapture {
      overflow: visible;
      color: rgba(0, 0, 0, 0);
      width: 32px;
      height: 32px;
      margin: 0;
      font-size: 0;
      opacity: 0.9;
      background: url("${svgDataUrl}") 50% 50% no-repeat;
      background-size: 82%;
      border: none;
      padding: 0;
      cursor: pointer;
      position: relative;
    }
    #player .imageCapture:hover {
      opacity: 1;
    }
  `;
    document.head.appendChild(style);

    const captureVideoFrame = (shouldDownloadImmediately = false) => {
      const video = document.getElementById("livePlayer") || document.getElementById("video");
      if (!video) {
        customLog.error("비디오 요소를 찾을 수 없습니다.");
        return;
      }

      // 캔버스 생성 및 비디오의 현재 프레임 그리기
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // 파일명을 위한 타임스탬프 생성
      const now = new Date();
      const pad = (n) => String(n).padStart(2, "0");
      const timestamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}_${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`;
      const filename = `capture_${timestamp}.jpg`;

      // 캔버스 이미지를 JPEG Blob 객체로 변환
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            customLog.error("Blob 데이터를 생성하는데 실패했습니다.");
            return;
          }

          // --- 여기서 인자에 따라 동작이 분기됩니다 ---

          if (shouldDownloadImmediately) {
            // [분기 1] 즉시 다운로드 로직
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url); // 다운로드 후 즉시 URL 해제
          } else {
            // [분기 2] 새 탭에서 열기 로직
            const imgURL = URL.createObjectURL(blob);
            const html = `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="UTF-8">
              <title>ScreenShot (${video.videoWidth}x${video.videoHeight})</title>
              <style>
                body { margin: 0; background: #000; display: flex; justify-content: center; align-items: center; height: 100vh; position: relative; }
                img { max-width: 100%; max-height: 100%; }
                #downloadBtn { position: absolute; top: 16px; right: 16px; padding: 8px 12px; background-color: #ffffffcc; border: none; border-radius: 4px; font-size: 14px; cursor: pointer; font-weight: bold; }
              </style>
            </head>
            <body>
              <img id="capturedImg" src="${imgURL}" alt="영상 캡쳐 이미지">
              <button id="downloadBtn">다운로드 ${filename}</button>
              <script>
                // 새 탭 안의 다운로드 버튼 클릭 이벤트
                document.getElementById('downloadBtn').addEventListener('click', () => {
                  const a = document.createElement('a');
                  a.href = document.getElementById('capturedImg').src;
                  a.download = '${filename}';
                  a.click();
                });

                // 새 탭이 닫힐 때 Blob URL을 해제하여 메모리 누수 방지
                window.addEventListener('beforeunload', () => {
                  URL.revokeObjectURL("${imgURL}");
                });
              </script>
            </body>
            </html>`;

            const blobURL = URL.createObjectURL(new Blob([html], { type: "text/html;charset=UTF-8" }));
            window.open(blobURL, "_blank");
            // 여기서 imgURL을 해제하면 새 탭에서 이미지가 보이지 않으므로, 새 탭 내부에서 해제합니다.
          }
        },
        "image/jpeg",
        0.92,
      );
    };
    // 2. 버튼 생성
    const createButton = () => {
      const btn = document.createElement("button");
      btn.className = "imageCapture";
      btn.type = "button";
      btn.title = "클릭: 새 탭에서 보기 / 우클릭: 바로 다운로드";

      // 좌클릭: 새 탭에서 열기
      btn.addEventListener("click", () => {
        try {
          // 인자를 false 또는 생략하여 호출
          captureVideoFrame(false);
        } catch (err) {
          customLog.error("캡처 실패:", err);
        }
      });

      // 우클릭: 즉시 다운로드
      btn.addEventListener("contextmenu", (event) => {
        event.preventDefault(); // 기본 컨텍스트 메뉴 방지
        try {
          // 인자를 true로 전달하여 호출
          captureVideoFrame(true);
        } catch (err) {
          customLog.error("캡처 및 다운로드 실패:", err);
        }
      });

      return btn;
    };
    // 3. 버튼 삽입
    const insertButton = async () => {
      try {
        const container = await waitForElementAsync("#player .player_ctrlBox .ctrlBox .right_ctrl");

        if (container && !container.querySelector(".imageCapture")) {
          const btn = createButton();
          container.insertBefore(btn, container.firstChild);
        }
      } catch (error) {
        customLog.error("버튼 추가 실패! 원인:", error.message);
      }
    };

    insertButton();
  };
  const addStyleExpandVODChat = () => {
    const style = `
            .expandVODChat:not(.screen_mode,.fullScreen_mode) #serviceHeader,
            .expandVODChat:not(.screen_mode,.fullScreen_mode) .broadcast_information,
            .expandVODChat:not(.screen_mode,.fullScreen_mode) .section_selectTab,
            .expandVODChat:not(.screen_mode,.fullScreen_mode) .wrapping.player_bottom{
                display: none !important;
            }
            .expandVODChat:not(.screen_mode,.fullScreen_mode) #webplayer_contents {
                margin: 0 auto !important;
                min-height: 100vh !important;
            }
        `;
    GM_addStyle(style);
  };
  const addStyleRemoveShadowsFromCatch = () => {
    const style = `
            .catch_webplayer_wrap .vod_player:after {
                background-image: none !important;
            }
        `;
    GM_addStyle(style);
  };
  const setupExpandVODChatFeature = async () => {
    try {
      const element = await waitForElementAsync("#chatting_area div.area_header > div.chat_title > ul", 15000); // 15초 타임아웃

      addStyleExpandVODChat();
      makeExpandChatButton(element, "expandVODChat"); // `await`로 받은 element를 사용
      toggleExpandChatShortcut();
      updateBodyClass("expandVODChat");
      window.addEventListener(
        "resize",
        debounce(() => updateBodyClass("expandVODChat"), 500),
      );
    } catch (error) {
      customLog.error("VOD 채팅 확장 기능 설정에 실패했습니다:", error.message);
    }
  };
  const setupExpandLiveChatFeature = async () => {
    try {
      // 1. 첫 번째 조건: 채팅창 헤더가 나타날 때까지 기다립니다.
      const element = await waitForElementAsync("#chatting_area div.area_header > div.chat_title > ul");

      // 2. 두 번째 조건: body에 'ratio169_mode' 클래스가 추가될 때까지 기다립니다.
      //await waitForConditionAsync(() => document.body.classList.contains('ratio169_mode'));

      // 3. 모든 조건이 충족되었으므로, 이제 기능들을 순서대로 실행합니다.
      addStyleExpandLiveChat();
      makeExpandChatButton(element, "expandLiveChat");
      toggleExpandChatShortcut();
      updateBodyClass("expandLiveChat");
      window.addEventListener(
        "resize",
        debounce(() => updateBodyClass("expandLiveChat"), 500),
      );
    } catch (error) {
      customLog.error("setupExpandLiveChatFeature 실패:", error.message);
    }
  };
  const setupSettingButtonTopbar = async () => {
    const serviceUtilDiv = await waitForElementAsync("div.serviceUtil");
    addModalSettings(serviceUtilDiv);
    const openModalBtnDiv = await waitForElementAsync("#openModalBtn > button");
    manageRedDot(openModalBtnDiv);
  };

  /**
   * 컨트롤러 상태에 따라 타겟 요소의 가시성을 제어하는 함수.
   * 타겟의 원래 display 속성을 기억하여 복원합니다.
   * @param {object} options
   * @param {HTMLInputElement[]} options.controllers - 상태를 제어할 체크박스 요소들의 배열
   * @param {HTMLElement[]} options.targets - 가시성이 제어될 요소들의 배열
   */
  function setupDependentVisibility(options) {
    const { controllers, targets } = options;

    if (!Array.isArray(controllers) || controllers.length === 0 || !Array.isArray(targets) || targets.length === 0) {
      customLog.error("필수 요소(controllers 배열, targets 배열)가 올바르게 전달되지 않았습니다.");
      return;
    }

    // 1. 함수가 처음 실행될 때 각 타겟의 원래 display 값을 data 속성에 저장
    targets.forEach((target) => {
      if (!target) return;
      // getComputedStyle로 CSS 파일에 정의된 display 값까지 가져옴
      const originalDisplay = window.getComputedStyle(target).display;

      // 만약 처음부터 display: none; 이었다면, 보여줄 때를 대비해 'block'을 기본값으로 저장
      target.dataset.originalDisplay = originalDisplay === "none" ? "block" : originalDisplay;
    });

    const updateVisibility = () => {
      const isAnyControllerChecked = controllers.some((controller) => controller.checked);

      targets.forEach((target) => {
        if (!target) return;
        // 2. 보여줄 때는 저장해둔 원래 display 값을 사용하고, 숨길 때는 'none'으로 설정
        target.style.display = isAnyControllerChecked ? target.dataset.originalDisplay : "none";
      });
    };

    controllers.forEach((controller) => {
      controller.addEventListener("change", updateVisibility);
    });

    // 초기 가시성 설정
    updateVisibility();
  }

  // --- 리캡 관련 유틸리티 함수 ---

  // --- 데이터 공유 및 인증 관련 함수 ---

  /**
   * 인증 카드 UI를 생성하여 화면에 표시합니다.
   * @param {object} data - 공유받은 인증 데이터 객체
   */
  function renderShareCard(data) {
    const wrapper = document.getElementById("recap-content-wrapper");
    const verifyContainer = document.getElementById("recap-verify-container");

    // streamer의 'n'은 닉네임, 't'는 시청 시간(초)을 의미합니다.
    const streamerListHTML = data.s
      .map(
        (streamer, index) => `
        <li class="shared-streamer">
            <span class="shared-rank">${index + 1}</span>
            <span class="shared-name">${streamer.n}</span>
            <span class="shared-time">${formatSecondsToHM(streamer.t)}</span>
        </li>
    `,
      )
      .join("");

    const cardHTML = `
        <div class="share-card">
            <div class="share-card-header">
                📊 ${data.m.replace("-", "년 ")}월 시청 기록 인증
            </div>
            <div class="share-card-body">
                <div class="share-info-item">
                    <span class="label">데이터 타입</span>
                    <span class="value">${data.t.toUpperCase()}</span>
                </div>
                <div class="share-info-item">
                    <span class="label">총 시청 시간</span>
                    <span class="value total-time">${formatSecondsToHM(data.w)}</span>
                </div>
                <div class="share-info-item column">
                    <span class="label">많이 본 스트리머 TOP 4</span>
                    <ul class="shared-streamer-list">${streamerListHTML}</ul>
                </div>
                <div class="share-info-item proof">
                    <span class="label">증명 메시지</span>
                    <span class="value proof-msg">${data.p}</span>
                </div>
            </div>
            <div class="share-card-footer">
                해시 검증 완료. (참고: 데이터의 변조를 번거롭게 했지만, 진위 자체를 보증하지는 않습니다)
            </div>
        </div>
    `;
    wrapper.innerHTML = cardHTML;

    // 인증 컨테이너는 숨기고, 결과 래퍼를 보여줌
    verifyContainer.style.display = "none";
    wrapper.style.display = "block";
  }

  /**
   * '인증 데이터 공유' 버튼 클릭 이벤트 핸들러
   */
  async function handleShareClick() {
    const proofMessage = prompt("공유 시 본인 증명을 위해 사용할 '증명 메시지'를 입력하세요.", "");
    if (proofMessage === null || proofMessage.trim() === "") {
      alert("증명 메시지가 입력되지 않아 취소되었습니다.");
      return;
    }
    const shareButton = document.getElementById("recap-share-button");
    const originalText = shareButton.innerHTML;
    shareButton.innerHTML = "...";
    shareButton.disabled = true;
    try {
      const userInfo = await getUserInfo();
      const typeSelector = document.getElementById("recap-type-selector");
      const monthSelector = document.getElementById("recap-month-selector");
      const selectedType = typeSelector.value;
      const [year, month] = monthSelector.value.split("-").map(Number);
      let startDate, endDate;
      const today = new Date();
      if (year === today.getFullYear() && month === today.getMonth() + 1) {
        startDate = new Date(year, month - 1, 1);
        endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
      } else {
        startDate = new Date(year, month - 1, 1);
        endDate = new Date(year, month, 0);
      }
      const formattedStartDate = formatDate(startDate);
      const formattedEndDate = formatDate(endDate);
      const modules = { live: { streamer: "UserLiveWatchTimeData" }, vod: { streamer: "UserVodWatchTimeData" } };
      let streamerData;
      if (selectedType === "live" || selectedType === "vod") {
        streamerData = await fetchData(userInfo.id, formattedStartDate, formattedEndDate, modules[selectedType].streamer);
      } else {
        const [liveStreamer, vodStreamer] = await Promise.all([fetchData(userInfo.id, formattedStartDate, formattedEndDate, modules.live.streamer), fetchData(userInfo.id, formattedStartDate, formattedEndDate, modules.vod.streamer)]);
        streamerData = mergeData(liveStreamer, vodStreamer, "streamer");
      }
      if (streamerData.result !== 1) throw new Error("데이터를 가져올 수 없습니다.");
      const totalWatchTime = streamerData.data.broad_cast_info.data.cumulative_watch_time;
      const top4Streamers = (
        streamerData.data.chart.data_stack
          ?.map((s) => ({ n: s.bj_nick, t: s.data.reduce((a, b) => a + b, 0) }))
          .filter((s) => s.n !== "기타")
          .sort((a, b) => b.t - a.t) || []
      ).slice(0, 4);
      const shareablePayload = { v: 1, m: `${year}-${month}`, t: selectedType, w: totalWatchTime, s: top4Streamers, p: proofMessage };
      const signature = await generateSignature(JSON.stringify(shareablePayload));
      const finalData = { ...shareablePayload, h: signature };
      const protectedString = protectData(finalData);
      if (!protectedString) throw new Error("인증 데이터 생성에 실패했습니다.");
      prompt("아래 문자열을 복사하여 공유하세요.", protectedString);
    } catch (error) {
      alert(`오류: ${error.message}`);
    } finally {
      shareButton.innerHTML = originalText;
      shareButton.disabled = false;
    }
  }

  /**
   * '인증 확인' 버튼 클릭 이벤트 핸들러
   */
  async function handleVerifyClick() {
    const input = document.getElementById("recap-verify-input");
    const sharedString = input.value.trim();
    if (!sharedString) {
      alert("인증 문자열을 붙여넣어 주세요.");
      return;
    }
    const restored = restoreData(sharedString);
    if (!restored || !restored.h) {
      alert("올바른 인증 데이터가 아닙니다.");
      return;
    }
    const { h, ...payload } = restored;
    const isValid = await verifySignature(h, JSON.stringify(payload));
    if (!isValid) {
      alert("데이터가 변조되었거나 손상되었습니다. 인증에 실패했습니다.");
      return;
    }
    renderShareCard(payload);
    input.value = "";
  }

  // --- 데이터 암호화/복호화 및 파일 처리 함수 ---

  // 데이터 보호를 위한 비밀 키 (이 값은 스크립트 내부에 고정됩니다)
  const RECAP_SECRET_KEY = "SoopRecapBackupKey";

  /**
   * 데이터를 보호(난독화) 처리합니다. (UTF-8 호환 버전)
   * @param {object} data - 보호할 데이터 객체
   * @returns {string} Base64로 인코딩된 보호된 문자열
   */
  function protectData(data) {
    try {
      const jsonString = JSON.stringify(data);
      const encoder = new TextEncoder(); // 문자열을 UTF-8 바이트로 변환
      const dataBytes = encoder.encode(jsonString);
      const secretKeyBytes = encoder.encode(RECAP_SECRET_KEY);

      // 각 바이트에 대해 XOR 암호화 수행
      const protectedBytes = new Uint8Array(dataBytes.length);
      for (let i = 0; i < dataBytes.length; i++) {
        protectedBytes[i] = dataBytes[i] ^ secretKeyBytes[i % secretKeyBytes.length];
      }

      // 바이트 배열을 btoa가 처리할 수 있는 바이너리 문자열로 변환
      let binaryString = "";
      protectedBytes.forEach((byte) => {
        binaryString += String.fromCharCode(byte);
      });

      // Base64 인코딩으로 마무리
      return btoa(binaryString);
    } catch (e) {
      customLog.error("데이터 보호 처리 실패:", e);
      return null;
    }
  }

  /**
   * 보호된 데이터를 원래 객체로 복원합니다. (UTF-8 호환 버전)
   * @param {string} protectedText - 보호된 텍스트
   * @returns {object|null} 복원된 데이터 객체 또는 실패 시 null
   */
  function restoreData(protectedText) {
    try {
      // Base64 디코딩으로 바이너리 문자열을 얻음
      const binaryString = atob(protectedText);
      if (binaryString.length === 0) return null;

      const encoder = new TextEncoder();
      const secretKeyBytes = encoder.encode(RECAP_SECRET_KEY);

      // 바이너리 문자열을 바이트 배열로 변환하며 동시에 XOR 복호화 수행
      const restoredBytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        const charCode = binaryString.charCodeAt(i);
        restoredBytes[i] = charCode ^ secretKeyBytes[i % secretKeyBytes.length];
      }

      // 복호화된 UTF-8 바이트 배열을 다시 문자열로 변환
      const decoder = new TextDecoder();
      const jsonString = decoder.decode(restoredBytes);

      // JSON 객체로 파싱
      return JSON.parse(jsonString);
    } catch (e) {
      customLog.error("데이터 복원 실패. 파일이 손상되었거나 잘못된 파일일 수 있습니다.", e);
      return null;
    }
  }

  const RECAP_SIGNING_KEY = "Soop-Recap-Verification-Secret-Key-!@#$";
  async function generateSignature(dataString) {
    const encoder = new TextEncoder();
    const keyData = encoder.encode(RECAP_SIGNING_KEY);
    const data = encoder.encode(dataString);
    const key = await crypto.subtle.importKey("raw", keyData, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
    const signatureBuffer = await crypto.subtle.sign("HMAC", key, data);
    const hashArray = Array.from(new Uint8Array(signatureBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  }
  async function verifySignature(signatureHex, dataString) {
    const encoder = new TextEncoder();
    const keyData = encoder.encode(RECAP_SIGNING_KEY);
    const data = encoder.encode(dataString);
    const signatureBytes = new Uint8Array(signatureHex.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)));
    const key = await crypto.subtle.importKey("raw", keyData, { name: "HMAC", hash: "SHA-256" }, false, ["verify"]);
    return await crypto.subtle.verify("HMAC", key, signatureBytes, data);
  }

  /**
   * 데이터 내보내기 버튼 클릭 이벤트 핸들러
   */
  async function handleExportClick() {
    const exportButton = document.getElementById("recap-export-button");
    const originalText = exportButton.innerHTML;
    exportButton.innerHTML = "...";
    exportButton.disabled = true;

    try {
      // 현재 선택된 조건으로 데이터를 새로 가져옴
      const userInfo = await getUserInfo();
      const typeSelector = document.getElementById("recap-type-selector");
      const monthSelector = document.getElementById("recap-month-selector");
      const selectedType = typeSelector.value;
      const selectedTypeText = typeSelector.options[typeSelector.selectedIndex].text;
      const [year, month] = monthSelector.value.split("-").map(Number);

      // (handleFetchButtonClick의 데이터 가져오는 로직과 동일)
      let startDate, endDate;
      const today = new Date();
      if (year === today.getFullYear() && month === today.getMonth() + 1) {
        startDate = new Date(year, month - 1, 1);
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);
        endDate = yesterday;
      } else {
        startDate = new Date(year, month - 1, 1);
        endDate = new Date(year, month, 0);
      }
      const formattedStartDate = formatDate(startDate);
      const formattedEndDate = formatDate(endDate);

      // ❗❗ [오류 수정] 누락되었던 modules 객체를 여기에 정의합니다.
      const modules = {
        live: { streamer: "UserLiveWatchTimeData", category: "UserLiveSearchKeywordData" },
        vod: { streamer: "UserVodWatchTimeData", category: "UserVodSearchKeywordData" },
      };

      let streamerData, categoryData;
      if (selectedType === "live" || selectedType === "vod") {
        [streamerData, categoryData] = await Promise.all([fetchData(userInfo.id, formattedStartDate, formattedEndDate, modules[selectedType].streamer), fetchData(userInfo.id, formattedStartDate, formattedEndDate, modules[selectedType].category)]);
      } else {
        // combined
        const [liveStreamer, liveCategory, vodStreamer, vodCategory] = await Promise.all([fetchData(userInfo.id, formattedStartDate, formattedEndDate, modules.live.streamer), fetchData(userInfo.id, formattedStartDate, formattedEndDate, modules.live.category), fetchData(userInfo.id, formattedStartDate, formattedEndDate, modules.vod.streamer), fetchData(userInfo.id, formattedStartDate, formattedEndDate, modules.vod.category)]);
        streamerData = mergeData(liveStreamer, vodStreamer, "streamer");
        categoryData = mergeData(liveCategory, vodCategory, "category");
      }

      if (streamerData.result !== 1) throw new Error("데이터를 가져올 수 없습니다.");

      const dataToProtect = { streamerData, categoryData, source: { year, month, type: selectedType, typeText: selectedTypeText, user: userInfo.nick } };
      const protectedContent = protectData(dataToProtect);

      if (!protectedContent) throw new Error("데이터 암호화에 실패했습니다.");

      // 파일 다운로드 실행
      const blob = new Blob([protectedContent], { type: "text/plain" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `soop-recap-backup-${year}-${month}-${selectedType}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } catch (error) {
      alert(`내보내기 오류: ${error.message}`);
    } finally {
      exportButton.innerHTML = originalText;
      exportButton.disabled = false;
    }
  }

  /**
   * 파일 가져오기(input) 변경 이벤트 핸들러
   * @param {Event} event
   */
  async function handleImportChange(event) {
    const file = event.target.files[0];
    if (!file) return;

    const loader = document.getElementById("recap-loader");
    const wrapper = document.getElementById("recap-content-wrapper");
    loader.style.display = "block";
    wrapper.innerHTML = "";

    const reader = new FileReader();
    reader.onload = async (e) => {
      const restored = restoreData(e.target.result);

      if (restored && restored.streamerData && restored.categoryData) {
        try {
          const userInfo = await getUserInfo();
          if (userInfo.nick !== restored.source.user) {
            if (!confirm(`이 파일은 '${restored.source.user}' 님의 데이터입니다. 현재 로그인된 '${userInfo.nick}' 님과 다릅니다. 계속 진행하시겠습니까?`)) {
              throw new Error("사용자 정보가 일치하지 않아 취소되었습니다.");
            }
          }

          const monthSelector = document.getElementById("recap-month-selector");
          const typeSelector = document.getElementById("recap-type-selector");

          // --- ❗ [수정] 이전 백업 선택지(찌꺼기) 완벽히 정리 ---
          // 1. ID로 추가된 임시 백업 옵션 제거
          const tempOption = document.getElementById("recap-backup-option-temp");
          if (tempOption) tempOption.remove();

          // 2. 기존 옵션에 추가됐던 (백업) 표시와 클래스 제거
          const modifiedOption = monthSelector.querySelector("option.backup-option");
          if (modifiedOption) {
            modifiedOption.textContent = modifiedOption.textContent.replace(" (백업)", "");
            modifiedOption.classList.remove("backup-option");
          }
          // --- 정리 끝 ---

          const importedValue = `${restored.source.year}-${restored.source.month}`;
          const optionExists = Array.from(monthSelector.options).find((opt) => opt.value === importedValue);

          if (optionExists) {
            // 원래 목록에 있는 월이면, 텍스트와 클래스만 수정
            optionExists.textContent += " (백업)";
            optionExists.classList.add("backup-option");
          } else {
            // 원래 목록에 없는 월이면, 고유 ID를 가진 새 옵션으로 추가
            const newOption = document.createElement("option");
            newOption.id = "recap-backup-option-temp"; // 나중에 쉽게 찾아서 제거하기 위한 ID
            newOption.value = importedValue;
            newOption.textContent = `${restored.source.year}년 ${restored.source.month}월 (백업)`;
            newOption.classList.add("backup-option");
            monthSelector.prepend(newOption);
          }

          monthSelector.value = importedValue;
          typeSelector.value = restored.source.type;

          const categoryImages = await getCategoryImageMap();
          await renderAll(restored.streamerData, restored.categoryData, userInfo, categoryImages);
          document.getElementById("recap-verify-container").style.display = "none"; // [추가]
          wrapper.style.display = "block";
        } catch (renderError) {
          wrapper.innerHTML = `<p style="text-align: center;">가져온 데이터 렌더링 오류: ${renderError.message}</p>`;
        }
      } else {
        wrapper.innerHTML = `<p style="text-align: center;">파일을 처리할 수 없습니다. 파일이 손상되었거나 올바른 리캡 백업 파일이 아닙니다.</p>`;
      }
      loader.style.display = "none";
      wrapper.style.display = "block";
    };
    reader.onerror = () => {
      wrapper.innerHTML = `<p style="text-align: center;">파일을 읽는 중 오류가 발생했습니다.</p>`;
      loader.style.display = "none";
      wrapper.style.display = "block";
    };
    reader.readAsText(file);

    event.target.value = "";
  }

  /**
   * 드롭다운 메뉴에 추가된 백업 관련 옵션을 모두 정리하여 초기 상태로 되돌립니다.
   * @param {HTMLElement} monthSelector - 월 선택 select 요소
   */
  function cleanupBackupOptions(monthSelector) {
    const backupOption = monthSelector.querySelector("option.backup-option");
    if (!backupOption) return; // 정리할 옵션이 없으면 종료

    const tempOption = document.getElementById("recap-backup-option-temp");
    if (tempOption) tempOption.remove();

    const modifiedOption = monthSelector.querySelector("option.backup-option");
    if (modifiedOption) {
      modifiedOption.textContent = modifiedOption.textContent.replace(" (백업)", "");
      modifiedOption.classList.remove("backup-option");
    }
  }

  /**
   * '인증 확인 UI'를 보여주는 이벤트 핸들러
   */
  function handleShowVerifyClick() {
    const verifyContainer = document.getElementById("recap-verify-container");
    const contentWrapper = document.getElementById("recap-content-wrapper");
    const monthSelector = document.getElementById("recap-month-selector");

    // 1. 기존에 표시되던 데이터(리캡, 인증 카드 등)를 숨기고 내용 비우기
    contentWrapper.style.display = "none";
    contentWrapper.innerHTML = "";

    // 2. 인증 확인 UI를 표시
    verifyContainer.style.display = "block";
    document.getElementById("recap-verify-input").focus(); // 입력창에 바로 포커스

    // 3. 다른 작업을 하기 전에 드롭다운 메뉴를 초기 상태로 정리
    cleanupBackupOptions(monthSelector);
  }
  /**
   * 1등 카드 중앙에서 축포 애니메이션을 실행합니다. (z-index 및 전체 화면 방식 적용)
   * @param {HTMLElement} targetCard - 애니메이션의 기준이 될 1등 카드 요소
   * @param {string} baseColorHex - 축포의 기본 색상 (Hex 코드)
   */
  function triggerVictoryConfetti(targetCard, baseColorHex) {
    if (typeof confetti !== "function") return;

    // 카드의 위치를 계산하여 축포 발사 원점을 설정
    const rect = targetCard.getBoundingClientRect();
    const origin = {
      x: (rect.left + rect.width / 2) / window.innerWidth,
      y: (rect.top + rect.height / 2) / window.innerHeight,
    };

    const colors = [baseColorHex, "#fff"];

    confetti({
      particleCount: 150,
      spread: 100,
      origin: origin,
      colors: colors,
      scalar: 1.2,
      ticks: 400,
      zIndex: 10001,
    });

    setTimeout(() => {
      confetti({
        particleCount: 200,
        spread: 30,
        origin: origin,
        colors: colors,
        angle: 90,
        startVelocity: 65,
        scalar: 1.3,
        ticks: 400,
        zIndex: 10001,
      });
    }, 300);
  }

  /**
   * '개근 달성' 카드 중앙에서 축포 애니메이션을 실행합니다. (위치 유효성 검사 추가)
   * @param {HTMLElement} targetElement - 애니메이션의 기준이 될 '개근 달성' 카드 요소
   */
  function triggerAttendanceConfetti(targetElement) {
    if (typeof confetti !== "function") return;

    const rect = targetElement.getBoundingClientRect();

    // ✨ 위치 정보가 유효하지 않으면(너비가 0이면) 함수를 즉시 종료하여 오류를 방지합니다.
    if (!rect || rect.width === 0) {
      customLog.error("Confetti: Target element's position could not be determined.");
      return;
    }

    const origin = {
      x: (rect.left + rect.width / 2) / window.innerWidth,
      y: (rect.top + rect.height / 2) / window.innerHeight,
    };

    const colors = ["#FFD700", "#C0C0C0", "#FFFFFF"];

    confetti({
      particleCount: 250,
      spread: 90,
      origin: origin,
      colors: colors,
      startVelocity: 30,
      gravity: 0.8,
      ticks: 500,
      zIndex: 10001,
    });
  }

  /**
   * 클릭 시 1등 카드 아바타 중앙에서 3가지 효과 중 하나를 랜덤으로 발사합니다.
   * @param {HTMLElement} targetElement - 발사 원점이 될 아바타 요소
   * @param {string} baseColorHex - 축포의 기본 색상 (Hex 코드)
   */
  function triggerClickConfetti(targetElement, baseColorHex) {
    if (typeof confetti !== "function") return;

    const rect = targetElement.getBoundingClientRect();
    const origin = {
      x: (rect.left + rect.width / 2) / window.innerWidth,
      y: (rect.top + rect.height / 2) / window.innerHeight,
    };

    const colors = [baseColorHex, "#FFFFFF"];

    // --- 3가지 축포 효과 프리셋 정의 ---

    // 1. 넓게 퍼지는 효과 (360도 폭발)
    const wideBurst = {
      particleCount: 150,
      spread: 360,
      startVelocity: 40,
      scalar: 1.1,
      ticks: 300,
    };

    // 2. 높이 솟구치는 효과 (기존 효과)
    const highFountain = {
      particleCount: 200,
      spread: 30,
      angle: 90,
      startVelocity: 75,
      scalar: 1.3,
      ticks: 400,
    };

    // 3. 중간 부채꼴 효과
    const mediumFan = {
      particleCount: 150,
      spread: 120,
      angle: 90,
      startVelocity: 60,
      scalar: 1.2,
      ticks: 350,
    };

    // 프리셋 배열
    const effects = [wideBurst, highFountain, mediumFan];

    // 0, 1, 2 중 하나의 숫자를 무작위로 선택
    const randomIndex = Math.floor(Math.random() * effects.length);

    // 선택된 효과를 가져옴
    const randomEffect = effects[randomIndex];

    // 공통 옵션과 선택된 효과 옵션을 합쳐서 실행
    confetti({
      origin: origin,
      colors: colors,
      zIndex: 10001,
      ...randomEffect, // 선택된 효과의 옵션을 여기에 적용
    });
  }

  /**
   * RGB 문자열 "rgb(r, g, b)"를 {r, g, b} 객체로 파싱합니다.
   * @param {string} rgbString - 파싱할 RGB 문자열
   * @returns {{r: number, g: number, b: number}|null}
   */
  function parseRgb(rgbString) {
    const match = rgbString.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (!match) return null;
    return {
      r: parseInt(match[1], 10),
      g: parseInt(match[2], 10),
      b: parseInt(match[3], 10),
    };
  }
  /**
   * RGB 색상을 HSL 색상으로 변환합니다.
   * @param {number} r - Red (0-255)
   * @param {number} g - Green (0-255)
   * @param {number} b - Blue (0-255)
   * @returns {{h: number, s: number, l: number}} - Hue(0-360), Saturation(0-1), Lightness(0-1)
   */
  function rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b),
      min = Math.min(r, g, b);
    let h = 0,
      s,
      l = (max + min) / 2;
    if (max === min) {
      h = s = 0; // achromatic
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }
    return { h: h * 360, s: s, l: l };
  }

  /**
   * HSL 색상을 RGB 색상으로 변환합니다.
   * @param {number} h - Hue (0-360)
   * @param {number} s - Saturation (0-1)
   * @param {number} l - Lightness (0-1)
   * @returns {string} - "rgb(r, g, b)" 형식의 문자열
   */
  function hslToRgbString(h, s, l) {
    let r, g, b;
    if (s === 0) {
      r = g = b = l; // achromatic
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h / 360 + 1 / 3);
      g = hue2rgb(p, q, h / 360);
      b = hue2rgb(p, q, h / 360 - 1 / 3);
    }
    return `rgb(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)})`;
  }

  /**
   * 단일 RGB 색상 문자열로부터 '강제 보정된' 밝은 유사색 그라디언트를 생성합니다.
   * @param {string} rgbString - "rgb(r, g, b)" 형식의 색상 문자열
   * @returns {string} - CSS linear-gradient 문자열
   */
  function createGradientFromRgb(rgbString) {
    const rgb = parseRgb(rgbString);
    if (!rgb) return "linear-gradient(135deg, #888, #777)";

    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

    // --- 색상 보정 로직 ---
    // 1. 채도(Saturation)가 너무 낮으면(0.6 미만) 0.6으로 강제 보정합니다.
    const vividSaturation = Math.max(hsl.s, 0.65);
    // 2. 밝기(Lightness)를 고정하여 항상 밝은 느낌을 유지합니다.
    const vividLightness = 0.65;

    // 보정된 채도와 밝기를 사용하여 첫 번째 색상을 다시 만듭니다.
    const color1 = hslToRgbString(hsl.h, vividSaturation, vividLightness);

    // 유사색의 색조를 계산합니다.
    const analogousHue = (hsl.h + 30) % 360;

    // 보정된 채도와 밝기를 사용하여 두 번째 색상도 만듭니다.
    const color2 = hslToRgbString(analogousHue, vividSaturation, vividLightness);

    return `linear-gradient(135deg, ${color1}, ${color2})`;
  }

  /**
   * 이미지 URL에서 평균 색상 코드를 추출하는 함수 (비동기)
   * @param {string} imageUrl - 분석할 이미지의 URL
   * @returns {Promise<string|null>} - 평균 색상의 16진수 코드 (예: '#RRGGBB') 또는 실패 시 null
   */
  function getAverageColor(imageUrl) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "Anonymous"; // CORS 이슈 방지를 위해 필수
      img.src = imageUrl;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        try {
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;
          let r = 0,
            g = 0,
            b = 0;

          for (let i = 0; i < data.length; i += 4) {
            r += data[i];
            g += data[i + 1];
            b += data[i + 2];
          }

          const pixelCount = data.length / 4;
          const avgR = Math.round(r / pixelCount);
          const avgG = Math.round(g / pixelCount);
          const avgB = Math.round(b / pixelCount);

          // 16진수 코드로 변환
          const hexCode = `#${((1 << 24) | (avgR << 16) | (avgG << 8) | avgB).toString(16).slice(1)}`;
          resolve(hexCode);
        } catch (e) {
          // getImageData에서 CORS 오류 발생 시
          customLog.error("평균 색상 추출 실패 (CORS 가능성):", e);
          reject(null);
        }
      };

      img.onerror = () => {
        customLog.error("이미지 로드 실패:", imageUrl);
        reject(null); // 이미지 로드 실패 시
      };
    });
  }

  /**
   * 16진수 색상 코드를 RGB 객체로 변환하는 함수
   * @param {string} hex - 16진수 색상 코드 (예: '#ffaa00')
   * @returns {{r: number, g: number, b: number}|null} - RGB 값 객체 또는 변환 실패 시 null
   */
  function hexToRgb(hex) {
    if (!hex || hex.length < 4) return null;
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  }

  function formatDate(date) {
    const y = date.getFullYear(),
      m = String(date.getMonth() + 1).padStart(2, "0"),
      d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }
  function formatSecondsToHMS(totalSeconds) {
    if (totalSeconds === 0) return "0초";
    const h = Math.floor(totalSeconds / 3600),
      m = Math.floor((totalSeconds % 3600) / 60),
      s = totalSeconds % 60;
    let p = [];
    if (h > 0) p.push(h + "시간");
    if (m > 0) p.push(m + "분");
    if (s > 0 || p.length === 0) p.push(s + "초");
    return p.join(" ");
  }
  function formatSecondsToHM(seconds) {
    const totalMinutes = Math.round(seconds / 60);
    if (totalMinutes < 1) return "1분 미만";
    const h = Math.floor(totalMinutes / 60),
      m = totalMinutes % 60;
    let p = [];
    if (h > 0) p.push(h + "시간");
    if (m > 0) p.push(m + "분");
    return p.join(" ") || "0분";
  }
  function formatAxisSeconds(seconds) {
    if (seconds === 0) return "0";
    if (seconds >= 3600) return Math.round(seconds / 3600) + "시간"; // Show hours
    if (seconds >= 60) return Math.round(seconds / 60) + "분"; // Show minutes
    return seconds + "초"; // Show seconds
  }
  function parseHMSToSeconds(timeString) {
    if (!timeString || typeof timeString !== "string") return 0;
    const parts = timeString.split(":").map(Number);
    while (parts.length < 3) {
      parts.unshift(0); // H나 M이 없는 경우를 위해 배열 앞쪽에 0을 추가
    }
    const [h, m, s] = parts;
    return h * 3600 + m * 60 + s;
  }
  function formatSecondsToHHMMSS(totalSeconds) {
    if (totalSeconds === 0) return "00:00:00";
    const h = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
    const m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
    const s = String(totalSeconds % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  }
  function createPlaceholderSvg(text) {
    const svg = `<svg width="150" height="150" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#2e2e33" /><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="60" fill="#efeff1">${text}</text></svg>`;
    return `data:image/svg+xml,${encodeURIComponent(svg)}`;
  }

  // --- 리캡 관련 API 호출 및 데이터 처리 함수 ---
  function getUserInfo() {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: "GET",
        url: INFO_API_URL,
        onload: (res) => {
          try {
            const d = JSON.parse(res.responseText);
            if (d?.CHANNEL?.IS_LOGIN === 1 && d.CHANNEL.LOGIN_ID) {
              resolve({ id: d.CHANNEL.LOGIN_ID, nick: d.CHANNEL.LOGIN_NICK });
            } else {
              reject(new Error("로그인 정보를 찾을 수 없습니다."));
            }
          } catch (e) {
            reject(new Error("로그인 정보 파싱 실패"));
          }
        },
        onerror: (err) => {
          reject(new Error("로그인 정보 API 요청 실패"));
        },
      });
    });
  }
  function fetchData(userId, startDate, endDate, module) {
    return new Promise((resolve, reject) => {
      const p = new URLSearchParams({ szModule: module, szMethod: "watch", szStartDate: startDate, szEndDate: endDate, nPage: 1, szId: userId });
      GM_xmlhttpRequest({
        method: "POST",
        url: STATS_API_URL,
        data: p.toString(),
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        onload: (res) => {
          if (res.status >= 200 && res.status < 300) {
            resolve(JSON.parse(res.responseText));
          } else {
            reject(new Error(`통계 데이터 요청 실패: ${res.statusText}`));
          }
        },
        onerror: (err) => {
          reject(new Error(`통계 API 요청 실패`));
        },
      });
    });
  }
  async function getStreamerProfileUrl(originalNick) {
    const search = (searchTerm) =>
      new Promise((resolve) => {
        const params = new URLSearchParams({ m: "searchHistory", service: "list", d: searchTerm });
        GM_xmlhttpRequest({
          method: "GET",
          url: `${SEARCH_API_URL}?${params.toString()}`,
          onload: (res) => {
            try {
              const data = JSON.parse(res.responseText);
              const exactMatch = data?.suggest_bj?.find((s) => s.user_nick === originalNick);
              resolve(exactMatch ? exactMatch.station_logo : null);
            } catch {
              resolve(null);
            }
          },
          onerror: () => resolve(null),
        });
      });
    let logoUrl = await search(originalNick);
    if (logoUrl) return logoUrl;
    const sanitizedNick = originalNick.replace(/[^\p{L}\p{N}\s]/gu, "");
    if (sanitizedNick !== originalNick) {
      logoUrl = await search(sanitizedNick);
      if (logoUrl) return logoUrl;
    }
    return null;
  }
  function imageToDataUri(url) {
    return new Promise((resolve) => {
      if (!url) {
        resolve(null);
        return;
      }
      GM_xmlhttpRequest({
        method: "GET",
        url: url,
        responseType: "blob",
        onload: function (response) {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = () => resolve(null);
          reader.readAsDataURL(response.response);
        },
        onerror: () => resolve(null),
      });
    });
  }
  async function getCategoryImageMap() {
    if (categoryImageMap) return categoryImageMap;
    return new Promise((resolve) => {
      const params = new URLSearchParams({ m: "categoryList", szOrder: "prefer", nListCnt: 200 });
      GM_xmlhttpRequest({
        method: "GET",
        url: `${CATEGORY_API_URL}?${params.toString()}`,
        onload: (res) => {
          try {
            const data = JSON.parse(res.responseText);
            const map = new Map();
            data?.data?.list?.forEach((cat) => map.set(cat.category_name, cat.cate_img));
            categoryImageMap = map;
            resolve(map);
          } catch {
            resolve(new Map());
          }
        },
        onerror: () => resolve(new Map()),
      });
    });
  }

  // --- UI 렌더링 함수 ---
  async function renderAll(streamerRawData, categoryRawData, userInfo, categoryImages) {
    const wrapper = document.getElementById("recap-content-wrapper");
    wrapper.innerHTML = "";
    const streamerData = streamerRawData?.data || {};
    const categoryData = categoryRawData?.data || {};
    const stats = streamerData?.broad_cast_info?.data || { average_watch_time: 0, cumulative_watch_time: 0 };
    const visitedDays = streamerData?.table1?.data?.filter((d) => d.total_watch_time !== "00:00:00").length || 0;

    let isPerfectAttendance = false;
    const tableDataAttendance = streamerData?.table1?.data;

    // 출석 데이터가 있을 경우에만 개근 여부 계산
    if (tableDataAttendance && tableDataAttendance.length > 0) {
      // 데이터의 첫 번째 날짜를 기준으로 Date 객체 생성 (예: "2024-06-01")
      const dataDate = new Date(tableDataAttendance[0].day);
      const year = dataDate.getFullYear();
      const month = dataDate.getMonth(); // 0부터 시작 (e.g., 6월은 5)

      // 데이터가 속한 월의 마지막 날짜를 가져와 총일수 계산
      const daysInMonth = new Date(year, month + 1, 0).getDate();

      isPerfectAttendance = visitedDays >= daysInMonth;
    }
    const allStreamersRaw = streamerData?.chart?.data_stack?.map((s) => ({ nick: s.bj_nick, total: s.data.reduce((a, b) => a + b, 0) })) || [];
    const otherEntry = allStreamersRaw.find((s) => s.nick === "기타");
    const sortedStreamers = allStreamersRaw.filter((s) => s.nick !== "기타").sort((a, b) => b.total - a.total);
    const allStreamersSorted = otherEntry ? [...sortedStreamers, otherEntry] : sortedStreamers;
    const top4Streamers = sortedStreamers.slice(0, 4);
    const rankedCategories = categoryData?.table2?.data || [];

    const profilePicUrl = `https://profile.img.sooplive.co.kr/LOGO/${userInfo.id.substring(0, 2)}/${userInfo.id}/${userInfo.id}.jpg`;
    const profileDataUri = await imageToDataUri(profilePicUrl);
    const placeholderUserAvatar = createPlaceholderSvg(userInfo.nick.substring(0, 1));
    const profileHeader = document.createElement("div");
    profileHeader.className = "recap-profile-header";
    profileHeader.innerHTML = `<img src="${profileDataUri || placeholderUserAvatar}" class="profile-pic" onerror="this.src='${placeholderUserAvatar}'"><span class="profile-name">${userInfo.nick}님</span>`;
    wrapper.appendChild(profileHeader);

    const keyStatsGrid = document.createElement("div");
    keyStatsGrid.className = "key-stats-grid";
    const attendanceCardClass = isPerfectAttendance ? "stat-card days perfect-attendance" : "stat-card days";
    const attendanceLabel = isPerfectAttendance ? "🎉 개근 달성" : "이 달의 출석";
    keyStatsGrid.innerHTML = `
        <div class="stat-card time">
            <div class="label">평균 ${formatSecondsToHM(stats.average_watch_time)}</div>
            <div class="value">${formatSecondsToHM(stats.cumulative_watch_time).replace(/(\d+)([가-힣]+)/g, '$1<span class="unit">$2</span>')}</div>
        </div>
        <div class="${attendanceCardClass}">
            <div class="label">${attendanceLabel}</div>
            <div class="value">${visitedDays}<span class="unit">일</span></div>
        </div>
    `;
    wrapper.appendChild(keyStatsGrid);

    if (isPerfectAttendance) {
      setTimeout(() => {
        const attendanceCard = wrapper.querySelector(".perfect-attendance");
        if (attendanceCard) {
          triggerAttendanceConfetti(attendanceCard);
        }
      }, 2000);
    }

    // --- 추가 끝 ---
    const topStreamersSection = document.createElement("div");
    topStreamersSection.innerHTML = `<div class="section-title">많이 본 방송</div>`;
    const topContainer = document.createElement("div");
    topContainer.className = "top-streamers-container";
    topStreamersSection.appendChild(topContainer);
    wrapper.appendChild(topStreamersSection);
    const avatarHttpUrls = await Promise.all(top4Streamers.map((s) => getStreamerProfileUrl(s.nick)));
    const avatarDataUris = await Promise.all(avatarHttpUrls.map((url) => imageToDataUri(url)));
    const streamerCardHTML = (streamer, avatarUri) => {
      const placeholder = createPlaceholderSvg(streamer.nick.substring(0, 1));
      return `<div class="streamer-card-bg" style="background-image: url(${avatarUri || placeholder})"></div><div class="streamer-card-content"><img src="${avatarUri || placeholder}" class="streamer-card-avatar" onerror="this.src='${placeholder}'"><div class="streamer-card-name">${streamer.nick}</div><div class="streamer-card-time">${formatSecondsToHM(streamer.total)}</div></div>`;
    };
    const [s1, s2, s3, s4] = top4Streamers;

    if (s1) {
      topContainer.innerHTML += `
            <div class="streamer-col-1 streamer-card shine-effect" data-rank="1">
                ${streamerCardHTML(s1, avatarDataUris[0])}
            </div>`;
    }
    //if (s1) topContainer.innerHTML += `<div class="streamer-col-1 streamer-card" data-rank="1">${streamerCardHTML(s1, avatarDataUris[0])}</div>`;
    if (s2) topContainer.innerHTML += `<div class="streamer-col-2 streamer-card" data-rank="2">${streamerCardHTML(s2, avatarDataUris[1])}</div>`;
    if (s3) topContainer.innerHTML += `<div class="streamer-col-3"><div class="streamer-card" data-rank="3">${streamerCardHTML(s3, avatarDataUris[2])}</div>${s4 ? `<div class="streamer-card" data-rank="4">${streamerCardHTML(s4, avatarDataUris[3])}</div>` : ""}</div>`;

    // ✨ --- 각 스트리머 카드에 평균 색상 데이터 저장 및 테두리/효과 적용 ---
    for (let i = 0; i < top4Streamers.length; i++) {
      const streamer = top4Streamers[i];
      const avatarUri = avatarDataUris[i];
      if (!streamer || !avatarUri) continue;

      const rank = i + 1;
      const card = wrapper.querySelector(`.streamer-card[data-rank="${rank}"]`);
      if (!card) continue;

      try {
        const avgColorHex = await getAverageColor(avatarUri);
        if (!avgColorHex) continue;

        const rgb = hexToRgb(avgColorHex);
        if (rgb) {
          // 1. 스크린샷을 위해 평균 색상 정보를 data 속성으로 저장 (모든 카드)
          card.dataset.avgColor = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;

          // 2. 프로필 아바타를 찾아 테두리 색상 변경 (모든 카드)
          const avatar = card.querySelector(".streamer-card-avatar");
          if (avatar) {
            avatar.style.borderColor = avgColorHex;
          }

          // 3. 1등 스트리머에게만 특별 시각 효과(그림자, 글로우) 추가
          if (rank === 1) {
            card.style.cursor = "pointer";

            card.addEventListener("click", () => {
              if (avatar) {
                triggerClickConfetti(avatar, avgColorHex);
              }
            });

            if (avatar) {
              const glowColorStart = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.5)`;
              const glowColorEnd = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.7)`;
              avatar.style.setProperty("--rank1-glow-color-start", glowColorStart);
              avatar.style.setProperty("--rank1-glow-color-end", glowColorEnd);
            }
            card.style.setProperty("--shine-color-solid", `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`);
            card.style.setProperty("--shine-color-glow", `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`);

            setTimeout(() => {
              if (avatar) {
                triggerVictoryConfetti(avatar, avgColorHex);
              }
            }, 1000);
          }
        }
      } catch (error) {
        customLog.error(`${rank}등 스트리머 평균 색상 적용 실패:`, error);
      }
    }

    const streamerCards = wrapper.querySelectorAll(".top-streamers-container .streamer-card");
    streamerCards.forEach((card) => {
      const rank = parseInt(card.dataset.rank, 10);

      if (rank === 1 || rank === 2) {
        card.addEventListener("mousemove", (e) => {
          const rect = card.getBoundingClientRect();
          const mouseX = e.clientX - rect.left;
          const mouseY = e.clientY - rect.top;
          const x = mouseX / rect.width - 0.5;
          const y = mouseY / rect.height - 0.5;
          let sensitivity = 0;
          let translateZ = 0;
          switch (rank) {
            case 1:
              sensitivity = 20;
              translateZ = 25;
              break;
            case 2:
              sensitivity = 15;
              break;
          }
          const rotateY = x * sensitivity;
          const rotateX = -y * sensitivity;
          card.style.setProperty("--mouse-x", `${mouseX}px`);
          card.style.setProperty("--mouse-y", `${mouseY}px`);
          card.style.setProperty("--mouse-x-percent", `${(mouseX / rect.width) * 200 - 50}%`);
          card.style.setProperty("--mouse-active", "1");
          const angle = Math.atan2(y, x) * (180 / Math.PI) + 90;
          card.style.setProperty("--angle", `${angle}deg`);
          card.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(${translateZ}px)`;
        });
        card.addEventListener("mouseleave", () => {
          card.style.transform = "perspective(1200px) rotateX(0) rotateY(0) translateZ(0)";
          card.style.setProperty("--mouse-active", "0");
        });
      }
    });

    const rankExpandButton = document.createElement("button");
    rankExpandButton.className = "expand-button";
    rankExpandButton.textContent = "전체 채널 순위 보기 ▾";
    wrapper.appendChild(rankExpandButton);
    const fullRankContainer = document.createElement("div");
    fullRankContainer.id = "full-ranking-chart-container";
    fullRankContainer.style.display = "none";
    wrapper.appendChild(fullRankContainer);
    let isRankChartRendered = false;
    const renderAndToggleRankChart = () => {
      const isHidden = fullRankContainer.style.display === "none";
      fullRankContainer.style.display = isHidden ? "block" : "none";
      rankExpandButton.textContent = isHidden ? "숨기기 ▴" : "전체 채널 순위 보기 ▾";
      if (isHidden && !isRankChartRendered) {
        const colors = ["#a95abf", "#5dade2", "#e74c3c", "#1abc9c", "#f1c40f", "#95a5a6", "#e67e22", "#e74c3c", "#2ecc71", "#f39c12"];
        const container = document.getElementById("full-ranking-chart-container");
        const chartHeight = Math.max(400, allStreamersSorted.length * 28);
        container.style.height = `${chartHeight}px`;
        const canvas = document.createElement("canvas");
        container.appendChild(canvas);
        activeCharts.push(new Chart(canvas, { type: "bar", data: { labels: allStreamersSorted.map((s) => s.nick), datasets: [{ label: "총 시청 시간", data: allStreamersSorted.map((s) => s.total), backgroundColor: colors }] }, options: { indexAxis: "y", responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { callbacks: { label: (c) => formatSecondsToHMS(c.parsed.x) } } }, scales: { x: { ticks: { color: "#efeff1", callback: (value) => formatAxisSeconds(value) }, grid: { color: "rgba(239, 239, 241, 0.1)" } }, y: { ticks: { color: "#efeff1", autoSkip: false }, grid: { color: "rgba(239, 239, 241, 0.1)" } } } } }));
        isRankChartRendered = true;
      }
    };
    rankExpandButton.addEventListener("click", renderAndToggleRankChart);

    const dailyExpandButton = document.createElement("button");
    dailyExpandButton.className = "expand-button";
    dailyExpandButton.textContent = "일별 통계 보기 ▾";
    wrapper.appendChild(dailyExpandButton);
    const dailyStatsContainer = document.createElement("div");
    dailyStatsContainer.id = "daily-stats-container";
    dailyStatsContainer.style.display = "none";
    const tableData = streamerData?.table1;
    if (tableData?.data) {
      let tableHTML = `<table><thead><tr><th>${tableData.column_name.day}</th><th>${tableData.column_name.total_watch_time}</th></tr></thead><tbody>`;
      tableData.data.forEach((row) => {
        tableHTML += `<tr><td>${row.day}</td><td>${row.total_watch_time}</td></tr>`;
      });
      dailyStatsContainer.innerHTML = tableHTML + "</tbody></table>";
    }
    wrapper.appendChild(dailyStatsContainer);
    dailyExpandButton.addEventListener("click", () => {
      const isHidden = dailyStatsContainer.style.display === "none";
      dailyStatsContainer.style.display = isHidden ? "block" : "none";
      dailyExpandButton.textContent = isHidden ? "숨기기 ▴" : "일별 통계 보기 ▾";
    });

    const categorySection = document.createElement("div");
    categorySection.innerHTML = `<div class="section-title" style="margin-top:20px;">자주 본 카테고리</div>`;
    const categoryGrid = document.createElement("div");
    categoryGrid.className = "category-grid";
    const totalCategoryCount = rankedCategories.reduce((sum, cat) => sum + parseInt(cat.cnt, 10), 0);
    const createCategoryCardHTML = (cat) => {
      const imgUrl = categoryImages.get(cat.skey) || createPlaceholderSvg(cat.skey.substring(0, 1));
      const percentage = totalCategoryCount > 0 ? ((cat.cnt / totalCategoryCount) * 100).toFixed(1) : 0;
      return `<div class="category-card" style="background-image: url(${imgUrl})"><div class="category-info"><div class="rank">#${cat.rank}</div><div>${cat.skey}</div><div class="percent">${percentage}%</div></div></div>`;
    };
    const top5Categories = rankedCategories.slice(0, 5);
    const restCategories = rankedCategories.slice(5);
    top5Categories.forEach((cat) => {
      categoryGrid.innerHTML += createCategoryCardHTML(cat);
    });
    categorySection.appendChild(categoryGrid);

    if (restCategories.length > 0) {
      const catExpandButton = document.createElement("button");
      catExpandButton.className = "expand-button";
      catExpandButton.textContent = "더보기 ▾";
      const moreCategoriesContainer = document.createElement("div");
      moreCategoriesContainer.className = "category-grid";
      moreCategoriesContainer.style.display = "none";
      restCategories.forEach((cat) => {
        moreCategoriesContainer.innerHTML += createCategoryCardHTML(cat);
      });
      catExpandButton.addEventListener("click", () => {
        const isHidden = moreCategoriesContainer.style.display === "none";
        moreCategoriesContainer.style.display = isHidden ? "grid" : "none";
        catExpandButton.textContent = isHidden ? "숨기기 ▴" : "더보기 ▾";
      });
      categorySection.appendChild(catExpandButton);
      categorySection.appendChild(moreCategoriesContainer);
    }
    wrapper.appendChild(categorySection);

    const otherInfoSection = document.createElement("div");
    otherInfoSection.innerHTML = `<div class="section-title" style="margin-top: 20px;">기타 정보</div>`;
    const chartContainer = document.createElement("div");
    chartContainer.className = "recap-container";
    otherInfoSection.appendChild(chartContainer);
    wrapper.appendChild(otherInfoSection);
    const createCard = (title) => {
      const c = document.createElement("div");
      c.className = "recap-card";
      const t = document.createElement("h2");
      t.textContent = title;
      const w = document.createElement("div");
      w.className = "chart-wrapper";
      const n = document.createElement("canvas");
      w.appendChild(n);
      c.appendChild(t);
      c.appendChild(w);
      chartContainer.appendChild(c);
      return n;
    };

    if (streamerData?.barchart?.device) {
      const deviceCanvas = createCard("시청 환경");
      const deviceLabels = Object.keys(streamerData.barchart.device).map((key) => deviceTranslations[key] || key);
      activeCharts.push(new Chart(deviceCanvas, { type: "doughnut", data: { labels: deviceLabels, datasets: [{ data: Object.values(streamerData.barchart.device), backgroundColor: ["#5dade2", "#a9cce3"], borderColor: "#2e2e33" }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: "#efeff1" } } } } }));
    }

    if (streamerData?.barchart?.vod_type) {
      const vodTypeData = streamerData.barchart.vod_type;
      // 값이 0보다 큰 데이터만 필터링
      const filteredVodTypes = Object.entries(vodTypeData).filter(([, value]) => value > 0);

      if (filteredVodTypes.length > 0) {
        const vodTypeCanvas = createCard("VOD 유형");
        const vodTypeLabels = filteredVodTypes.map(([key]) => vodTypeTranslations[key] || key);
        const vodTypeValues = filteredVodTypes.map(([, value]) => value);

        activeCharts.push(
          new Chart(vodTypeCanvas, {
            type: "doughnut",
            data: {
              labels: vodTypeLabels,
              datasets: [
                {
                  data: vodTypeValues,
                  backgroundColor: chartColors, // 미리 정의한 색상 팔레트 사용
                  borderColor: "#2e2e33",
                },
              ],
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  labels: {
                    color: "#efeff1",
                  },
                },
              },
            },
          }),
        );
      }
    }

    if (streamerData?.barchart?.bj_type) {
      const typeCanvas = createCard("스트리머 유형 분포");
      const typeLabels = Object.keys(streamerData.barchart.bj_type).map((key) => typeTranslations[key] || key);
      activeCharts.push(new Chart(typeCanvas, { type: "bar", data: { labels: typeLabels, datasets: [{ data: Object.values(streamerData.barchart.bj_type), backgroundColor: ["#ff6b6b", "#feca57", "#1dd1a1"] }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { ticks: { color: "#efeff1" } }, y: {} } } }));
    }
  }

  function mergeData(liveData, vodData, type) {
    if (!liveData || liveData.result !== 1) return vodData || { result: 1, data: {} };
    if (!vodData || vodData.result !== 1) return liveData || { result: 1, data: {} };

    const merged = JSON.parse(JSON.stringify(liveData)); // Deep copy

    if (type === "streamer") {
      const liveInfo = liveData.data.broad_cast_info.data;
      const vodInfo = vodData.data.broad_cast_info.data;
      const mergedInfo = merged.data.broad_cast_info.data;

      if (vodInfo) {
        mergedInfo.cumulative_watch_time += vodInfo.cumulative_watch_time;
        mergedInfo.top_watch_time = Math.max(liveInfo.top_watch_time, vodInfo.top_watch_time);
        // 평균 시청 시간은 누적 시간을 기준으로 재계산 (방문일수 데이터가 없으므로 단순 합산은 부정확)
        // 여기서는 일단 누적 시간 합산에 집중합니다.
      }

      const streamerTotals = new Map();

      liveData.data.chart.data_stack?.forEach((s) => {
        if (s.bj_nick !== "기타")
          streamerTotals.set(
            s.bj_nick,
            s.data.reduce((a, b) => a + b, 0),
          );
      });
      vodData.data.chart.data_stack?.forEach((s) => {
        if (s.bj_nick !== "기타") streamerTotals.set(s.bj_nick, (streamerTotals.get(s.bj_nick) || 0) + s.data.reduce((a, b) => a + b, 0));
      });

      const sortedStreamers = Array.from(streamerTotals.entries()).sort((a, b) => b[1] - a[1]);

      // renderAll 함수가 기대하는 data_stack 포맷으로 재구성
      merged.data.chart.data_stack = sortedStreamers.map(([nick, total]) => ({
        bj_nick: nick,
        data: [total], // 합산된 총 시간을 data 배열에 넣음
      }));

      const dailyTotals = new Map();

      // 1. Live 데이터의 일별 시청 시간을 초 단위로 변환하여 Map에 저장
      liveData.data.table1?.data?.forEach((row) => {
        dailyTotals.set(row.day, parseHMSToSeconds(row.total_watch_time));
      });

      // 2. VOD 데이터의 일별 시청 시간을 기존 값에 더해줌
      vodData.data.table1?.data?.forEach((row) => {
        const existingSeconds = dailyTotals.get(row.day) || 0;
        dailyTotals.set(row.day, existingSeconds + parseHMSToSeconds(row.total_watch_time));
      });

      // 3. 합산된 데이터를 다시 table1.data 형식으로 변환
      if (merged.data.table1) {
        // table1 객체가 존재하는지 확인
        const sortedDays = Array.from(dailyTotals.entries()).sort((a, b) => a[0].localeCompare(b[0]));

        merged.data.table1.data = sortedDays.map(([day, totalSeconds]) => ({
          day: day,
          total_watch_time: formatSecondsToHHMMSS(totalSeconds),
        }));
      }
    } else if (type === "category") {
      const categoryTotals = new Map();

      liveData.data.table2?.data?.forEach((c) => categoryTotals.set(c.skey, parseInt(c.cnt, 10)));
      vodData.data.table2?.data?.forEach((c) => categoryTotals.set(c.skey, (categoryTotals.get(c.skey) || 0) + parseInt(c.cnt, 10)));

      const sortedCategories = Array.from(categoryTotals.entries()).sort((a, b) => b[1] - a[1]);

      merged.data.table2.data = sortedCategories.map(([skey, cnt], index) => ({
        rank: index + 1,
        skey: skey,
        cnt: String(cnt),
      }));
    }

    return merged;
  }

  // --- 이벤트 핸들러 함수 ---
  async function handleFetchButtonClick() {
    const monthSelector = document.getElementById("recap-month-selector");

    const selectedOption = monthSelector.options[monthSelector.selectedIndex];
    if (selectedOption && selectedOption.classList.contains("backup-option")) {
      alert("백업 데이터가 선택된 상태에서는 서버에 데이터를 조회할 수 없습니다.\n다른 월을 선택한 후 다시 시도해 주세요.");
      return;
    }

    // --- ❗ [수정] 백업 선택지(찌꺼기) 완벽히 정리 ---
    // 1. ID로 추가된 임시 백업 옵션 제거
    const tempOption = document.getElementById("recap-backup-option-temp");
    if (tempOption) tempOption.remove();

    // 2. 기존 옵션에 추가됐던 (백업) 표시와 클래스 제거
    const modifiedOption = monthSelector.querySelector("option.backup-option");
    if (modifiedOption) {
      modifiedOption.textContent = modifiedOption.textContent.replace(" (백업)", "");
      modifiedOption.classList.remove("backup-option");
    }
    // --- 정리 끝 ---

    const loader = document.getElementById("recap-loader");
    const wrapper = document.getElementById("recap-content-wrapper");
    loader.style.display = "block";
    wrapper.innerHTML = "";
    wrapper.style.display = "none";
    activeCharts.forEach((chart) => chart.destroy());
    activeCharts = [];

    try {
      const userInfo = await getUserInfo();
      const typeSelector = document.getElementById("recap-type-selector");
      const selectedType = typeSelector.value;
      const [year, month] = monthSelector.value.split("-").map(Number);

      // (이하 기존 코드와 동일)
      let startDate, endDate;
      const today = new Date();
      if (year === today.getFullYear() && month === today.getMonth() + 1) {
        startDate = new Date(year, month - 1, 1);
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);
        endDate = yesterday;
      } else {
        startDate = new Date(year, month - 1, 1);
        endDate = new Date(year, month, 0);
      }
      const formattedStartDate = formatDate(startDate);
      const formattedEndDate = formatDate(endDate);

      const modules = {
        live: { streamer: "UserLiveWatchTimeData", category: "UserLiveSearchKeywordData" },
        vod: { streamer: "UserVodWatchTimeData", category: "UserVodSearchKeywordData" },
      };
      const categoryImages = await getCategoryImageMap();
      let streamerData, categoryData;

      if (selectedType === "live" || selectedType === "vod") {
        [streamerData, categoryData] = await Promise.all([fetchData(userInfo.id, formattedStartDate, formattedEndDate, modules[selectedType].streamer), fetchData(userInfo.id, formattedStartDate, formattedEndDate, modules[selectedType].category)]);
      } else {
        // combined
        const [liveStreamer, liveCategory, vodStreamer, vodCategory] = await Promise.all([fetchData(userInfo.id, formattedStartDate, formattedEndDate, modules.live.streamer), fetchData(userInfo.id, formattedStartDate, formattedEndDate, modules.live.category), fetchData(userInfo.id, formattedStartDate, formattedEndDate, modules.vod.streamer), fetchData(userInfo.id, formattedStartDate, formattedEndDate, modules.vod.category)]);
        streamerData = mergeData(liveStreamer, vodStreamer, "streamer");
        categoryData = mergeData(liveCategory, vodCategory, "category");
      }

      if (streamerData.result === 1 && categoryData.result === 1) {
        await renderAll(streamerData, categoryData, userInfo, categoryImages);
        document.getElementById("recap-verify-container").style.display = "none"; // [추가]
      } else {
        wrapper.innerHTML = `<p style="text-align: center;">데이터를 불러오는 데 실패했습니다.</p>`;
      }
    } catch (error) {
      customLog.error("[리캡 스크립트] Error:", error);
      wrapper.innerHTML = `<p style="text-align: center;">오류 발생: ${error.message}</p>`;
    } finally {
      loader.style.display = "none";
      wrapper.style.display = "block";
    }
  }

  async function captureScreenshot(options = {}) {
    const modalBody = document.querySelector(".recap-modal-body");
    const modalPanel = document.getElementById("recap-modal-panel");
    const button = document.getElementById("recap-screenshot-btn");
    const originalButtonContent = button.innerHTML;
    button.innerHTML = "...";
    button.disabled = true;

    // --- 원본 스타일 및 요소 상태 저장 ---
    const originalPanelHeight = modalPanel.style.height;
    const originalBodyOverflow = modalBody.style.overflowY;
    const cardElements = modalBody.querySelectorAll(".top-streamers-container .streamer-card");
    const originalCardStyles = [];
    const profileHeader = modalBody.querySelector(".recap-profile-header");
    let originalProfileDisplay = "";

    // --- 스크린샷용 임시 요소 생성 및 수정 ---
    const typeSelector = document.getElementById("recap-type-selector");
    const monthSelector = document.getElementById("recap-month-selector");
    const selectedTypeText = typeSelector.options[typeSelector.selectedIndex].text;
    const screenshotTitle = document.createElement("div");
    screenshotTitle.id = "screenshot-title-temp";
    screenshotTitle.textContent = `${monthSelector.options[monthSelector.selectedIndex].text} 시청 요약 (${selectedTypeText})`;

    // --- 스크린샷 전처리 ---
    const fallbackGradient = "linear-gradient(135deg, #6e45e2, #88d3ce)"; // 폴백 그라디언트

    cardElements.forEach((el) => {
      const bgChild = el.querySelector(".streamer-card-bg");
      originalCardStyles.push({ el, background: el.style.background, bgChild, childDisplay: bgChild?.style.display });

      // ✨ 각 카드에 저장된 data-avg-color 속성을 읽어옵니다.
      const avgColor = el.dataset.avgColor;

      // ✨ 해당 색상으로 그라디언트를 생성하거나, 실패 시 폴백 그라디언트를 적용합니다.
      el.style.background = avgColor ? createGradientFromRgb(avgColor) : fallbackGradient;

      if (bgChild) bgChild.style.display = "none";
    });

    if (options.hideProfile && profileHeader) {
      originalProfileDisplay = profileHeader.style.display;
      profileHeader.style.display = "none";
    }

    try {
      modalBody.prepend(screenshotTitle);
      modalPanel.style.height = "auto";
      modalBody.style.overflowY = "visible";

      const canvas = await html2canvas(modalBody, {
        allowTaint: true,
        useCORS: true,
        backgroundColor: "#18181b",
        logging: false,
      });

      const link = document.createElement("a");
      const date = new Date();
      const timestamp = `${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, "0")}${date.getDate().toString().padStart(2, "0")}`;
      const selectedType = typeSelector.value;
      link.download = `recap-${selectedType}-${timestamp}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      customLog.error("스크린샷 생성 오류:", err);
      alert("스크린샷 생성에 실패했습니다.");
    } finally {
      // --- 모든 변경사항 원래대로 복구 ---
      button.innerHTML = originalButtonContent;
      button.disabled = false;
      modalPanel.style.height = originalPanelHeight;
      modalBody.style.overflowY = originalBodyOverflow;

      originalCardStyles.forEach((item) => {
        item.el.style.background = item.background;
        if (item.bgChild) item.bgChild.style.display = item.childDisplay;
      });

      if (options.hideProfile && profileHeader) {
        profileHeader.style.display = originalProfileDisplay;
      }

      screenshotTitle.remove();
    }
  }

  function createRecapModule() {
    // 이미 UI가 생성되었다면 함수를 즉시 종료하여 중복 생성을 방지합니다.
    if (recapModalBackdrop) {
      customLog.warn("Recap module UI is already created. Skipping creation.");
      return;
    }

    // --- 1. 스타일(CSS) 주입 ---
    GM_addStyle(`
/* =================================================================
    모달 (Modal) 기본 스타일
================================================================= */
#recap-modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.6);
    z-index: 10000;
    display: flex;
    justify-content: center;
    align-items: center;
}
#recap-modal-panel {
    background-color: #18181b;
    color: #efeff1;
    width: 90%;
    max-width: 1000px;
    height: 90vh;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    display: flex;
    flex-direction: column;
    overflow: hidden;
}
.recap-modal-header {
    padding: 15px 25px;
    border-bottom: 1px solid #4f4f54;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-shrink: 0;
}
.recap-modal-header h1 {
    margin: 0;
    font-size: 20px;
    color: #5dade2;
}
.recap-modal-header-buttons {
    display: flex;
    align-items: center;
    gap: 10px;
}
/* 헤더 아이콘 버튼 공통 스타일 */
.recap-modal-header-buttons button,
.recap-modal-header-buttons label {
    background: none;
    border: none;
    color: #efeff1;
    font-size: 22px;
    cursor: pointer;
    width: 36px;
    height: 36px;
    display: grid;
    place-items: center;
    border-radius: 50%;
    padding: 0;
}
.recap-modal-header-buttons button:hover,
.recap-modal-header-buttons label:hover {
    background-color: #2e2e33;
}
#recap-import-input {
    display: none;
}
.recap-modal-controls {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 15px;
    padding: 20px;
    border-bottom: 1px solid #4f4f54;
    flex-shrink: 0;
}
.recap-modal-controls select,
.recap-modal-controls button {
    padding: 10px 15px;
    border-radius: 6px;
    border: 1px solid #4f4f54;
    background-color: #2e2e33;
    color: #efeff1;
    font-size: 16px;
}
.recap-modal-controls button {
    background-color: #5dade2;
    border-color: #5dade2;
    cursor: pointer;
}
.recap-modal-controls button:hover {
    background-color: #4a9fce;
}
.recap-modal-body {
    padding: 20px;
    overflow-y: auto;
    flex-grow: 1;
}
#recap-loader {
    text-align: center;
    padding: 40px;
    font-size: 18px;
}
#screenshot-title-temp {
    font-size: 24px;
    font-weight: bold;
    text-align: center;
    margin-bottom: 20px;
    color: #efeff1;
}

/* =================================================================
   콘텐츠 공통 스타일
================================================================= */
.section-title {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 15px;
}
.expand-button {
    width: 100%;
    padding: 10px;
    background-color: #2e2e33;
    color: #efeff1;
    border: 1px solid #4f4f54;
    border-radius: 6px;
    cursor: pointer;
    margin-top: 15px;
    margin-bottom: 10px;
}
.recap-profile-header {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-bottom: 20px;
}
.recap-profile-header .profile-pic {
    width: 70px;
    height: 70px;
    border-radius: 50%;
    border: 3px solid #5dade2;
}
.recap-profile-header .profile-name {
    font-size: 24px;
    font-weight: bold;
}

/* =================================================================
   ✨ 재사용 가능한 효과 (Shine Effect)
================================================================= */
@keyframes shine {
    100% {
        left: 200%;
    }
}

/* 그림자 효과가 필요한 요소에 이 클래스를 추가합니다. */
.shine-effect {
    /* CSS 변수를 사용하여 그림자 색상 정의 */
    --shine-color-solid: rgb(181, 164, 46);
    --shine-color-glow: rgb(255, 202, 97);
    filter:
        drop-shadow(0px 0px 6px var(--shine-color-solid)) drop-shadow(0px 0px 6px var(--shine-color-glow));
}

/* 반짝이는 애니메이션 효과 (::before 가상요소 사용) */
.stat-card.days.perfect-attendance::before,
.shine-effect .streamer-card-bg::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient( 120deg, rgba(255,255,255,0) 20%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0) 80% );
    z-index: 1;
    animation: shine 3s infinite linear;
    transform: skewX(-25deg);
}


/* =================================================================
   핵심 통계 카드 (Key Stats)
================================================================= */
.key-stats-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-bottom: 20px;
}
.stat-card {
    border-radius: 8px;
    padding: 20px;
    text-align: center;
    color: #333;
}
.stat-card.time {
    background: linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%);
}
.stat-card.days {
    background: linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%);
    position: relative;
    overflow: hidden;
}
.stat-card.days.perfect-attendance {
    filter:
        drop-shadow(0px 0px 4px rgba(54, 127, 162, 0.99)) drop-shadow(0px 0px 4px rgba(44, 206, 255, 0.74));
}
.stat-card .label {
    font-size: 14px;
    opacity: 0.8;
}
.stat-card .value {
    font-size: 48px;
    font-weight: bold;
    line-height: 1.1;
}
.stat-card .unit {
    font-size: 24px;
    margin-left: 5px;
}

/* =================================================================
   많이 본 방송 (Top Streamers)
================================================================= */

.top-streamers-container {
    display: flex;
    gap: 15px;
    height: 320px;
    margin-bottom: 15px;
}
.streamer-card {
    border-radius: 8px;
    padding: 15px;
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
.streamer-card-bg {
    position: absolute;
    top: -10%;
    left: -10%;
    width: 120%;
    height: 120%;
    background-size: cover;
    background-position: center;
    filter: blur(10px) brightness(0.7);
    z-index: 1;
    overflow: hidden;
}
.streamer-card-content {
    position: relative; /* z-index가 적용되도록 */
    z-index: 2;
    color: white;
    text-align: center;
}
.streamer-card-avatar {
    border-radius: 50%;
    border: 2px solid white;
    object-fit: cover;
}
.streamer-card-name,
.streamer-card-time {
    text-shadow: 1px 1px 4px rgba(0,0,0,0.8);
}
.streamer-card-name {
    font-weight: bold;
}
.streamer-card-time {
    opacity: 0.9;
}
.streamer-col-1 { flex: 2; }
.streamer-col-2 { flex: 1; }
.streamer-col-3 { flex: 1; display: flex; flex-direction: column; gap: 15px; }
.streamer-col-3 .streamer-card { flex: 1; }

.streamer-col-1 .streamer-card-avatar { width: 130px; height: 130px; margin-bottom: 10px; }
.streamer-col-2 .streamer-card-avatar { width: 100px; height: 100px; margin-bottom: 10px; }
.streamer-col-1 .streamer-card-name { font-size: 40px; }
.streamer-col-1 .streamer-card-time { font-size: 30px; margin-top: 5px; }
.streamer-col-2 .streamer-card-name { font-size: 30px; }
.streamer-col-2 .streamer-card-time { font-size: 20px; margin-top: 5px; }
.streamer-col-3 .streamer-card-avatar { width: 70px; height: 70px; margin-bottom: 5px; }
.streamer-col-3 .streamer-card-name { font-size: 20px; }
.streamer-col-3 .streamer-card-time { font-size: 16px; }

/* 1등 카드 아바타에 글로우 효과 적용 */
.streamer-card[data-rank="1"] .streamer-card-avatar {
    --rank1-border-color: #ffd760;
    /* ❗ 애니메이션을 위한 기본 색상 변수 추가 (rgba 사용) */
    --rank1-glow-color-start: rgba(255, 215, 96, 0.5);
    --rank1-glow-color-end: rgba(255, 215, 96, 0.7);

    border-color: var(--rank1-border-color);
}

/* =================================================================
   카테고리 (Category)
================================================================= */
.category-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 15px; }
.category-card {
    border-radius: 8px;
    background-size: cover;
    background-position: center;
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 10px;
    background-color: #2e2e33;
    aspect-ratio: 3 / 4;
}
.category-card::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 50%);
    border-radius: 8px;
}
.category-info {
    z-index: 2;
    color: white;
    font-weight: bold;
    font-size: 14px;
    text-shadow: 1px 1px 3px rgba(0,0,0,0.7);
}
.category-info .rank { font-size: 18px; }
.category-info .percent { font-size: 12px; opacity: 0.8; }


/* =================================================================
   기타 정보 및 차트 (Other Info & Charts)
================================================================= */
#full-ranking-chart-container {
    margin-bottom: 20px;
}
#daily-stats-container table {
    width: 100%;
    border-collapse: collapse;
}
#daily-stats-container th,
#daily-stats-container td {
    text-align: left;
    padding: 12px;
    border-bottom: 1px solid #4f4f54;
}
#daily-stats-container th {
    background-color: #3a3a40;
}
.recap-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
}
.recap-card {
    background-color: #2e2e33;
    border-radius: 8px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    min-height: 300px;
}
.recap-card h2 {
    flex-shrink: 0;
    margin-top: 0;
    border-bottom: 1px solid #4f4f54;
    padding-bottom: 10px;
}
.chart-wrapper {
    position: relative;
    flex-grow: 1;
    min-height: 0;
}

/* 헤더 아이콘 버튼에 공유 버튼 추가 */
.recap-modal-header-buttons button,
.recap-modal-header-buttons label {
    font-size: 20px; /* 아이콘 크기 통일 */
}

/* 인증 확인 UI 스타일 */
#recap-verify-container {
    padding: 30px;
    text-align: center;
}
#recap-verify-container h3 {
    margin-top: 0;
    color: #ccc;
    font-weight: normal;
}
#recap-verify-input {
    width: 100%;
    height: 100px;
    background-color: #2e2e33;
    border: 1px solid #4f4f54;
    color: #efeff1;
    border-radius: 6px;
    padding: 10px;
    margin-bottom: 15px;
    resize: vertical;
}
#recap-verify-button {
    padding: 10px 20px;
    font-size: 16px;
    background-color: #1abc9c;
    border-color: #1abc9c;
}
#recap-verify-button:hover {
    background-color: #16a085;
}

/* 공유 카드 스타일 */
.share-card { border: 1px solid #4f4f54; border-radius: 8px; margin: 10px; }
.share-card-header { background-color: #3a3a40; padding: 15px; font-size: 18px; font-weight: bold; border-bottom: 1px solid #4f4f54; border-radius: 8px 8px 0 0;}
.share-card-body { padding: 20px; display: flex; flex-direction: column; gap: 20px; }
.share-info-item { display: flex; justify-content: space-between; align-items: center; }
.share-info-item.column { flex-direction: column; align-items: flex-start; gap: 10px; }
.share-info-item .label { color: #aaa; }
.share-info-item .value { font-weight: bold; font-size: 18px; }
.share-info-item .value.total-time { color: #5dade2; }
.share-info-item.proof { background-color: rgba(255,255,255,0.05); padding: 15px; border-radius: 6px; flex-direction: column; align-items: flex-start; gap: 8px;}
.share-info-item .value.proof-msg { font-size: 16px; font-weight: normal; color: #efeff1; }
.share-card-footer { background-color: #27ae60; color: white; text-align: center; padding: 10px; font-size: 14px; border-radius: 0 0 8px 8px;}
.shared-streamer-list { list-style: none; padding: 0; width: 100%; margin: 0; }
.shared-streamer { display: flex; align-items: center; padding: 8px 0; border-bottom: 1px solid #2e2e33; }
.shared-streamer:last-child { border-bottom: none; }
.shared-rank { color: #aaa; width: 30px; font-style: italic; }
.shared-name { flex-grow: 1; }
.shared-time { color: #ccc; }

    `);

    // --- 2. UI 요소 생성 및 DOM에 추가 ---
    recapModalBackdrop = document.createElement("div");
    recapModalBackdrop.id = "recap-modal-backdrop";
    recapModalBackdrop.innerHTML = `
    <div id="recap-modal-panel">
        <div class="recap-modal-header">
            <h1>월별 방송 데이터 리캡</h1>
            <div class="recap-modal-header-buttons">
                <button id="recap-share-button" title="인증 데이터 공유">🔗</button>
                <button id="recap-show-verify-button" title="공유받은 데이터 확인">📋</button>
                <button id="recap-export-button" title="백업 파일 내보내기">⬇️</button>
                <label for="recap-import-input" id="recap-import-label" title="백업 파일 가져오기">⬆️</label>
                <input type="file" id="recap-import-input" accept=".txt">
                <button id="recap-screenshot-btn" title="스크린샷 다운로드 (우클릭: 닉네임 숨기기)">🖼️</button>
                <button id="recap-modal-close-btn">&times;</button>
            </div>
        </div>
        <div class="recap-modal-controls">
            <select id="recap-type-selector">
                <option value="live" selected>LIVE</option>
                <option value="vod">VOD</option>
                <option value="combined">LIVE + VOD</option>
            </select>
            <select id="recap-month-selector"></select>
            <button id="recap-fetch-button">데이터 조회</button>
        </div>
        <div class="recap-modal-body">
            <div id="recap-loader" style="display: none;"><p>데이터를 불러오는 중입니다...</p></div>

            <div id="recap-verify-container" style="display: none;">
                <h3>공유받은 인증 데이터 확인</h3>
                <textarea id="recap-verify-input" placeholder="여기에 공유받은 문자열을 붙여넣으세요."></textarea>
                <button id="recap-verify-button" class="recap-modal-controls button">인증 확인</button>
            </div>

            <div id="recap-content-wrapper">
                 <p style="text-align: center; padding: 30px; color: #888;">
                    조회할 타입을 선택하고 '데이터 조회' 버튼을 누르거나<br>
                    상단의 아이콘을 통해 데이터를 가져오거나 인증을 확인하세요.
                 </p>
            </div>
        </div>
    </div>`;
    document.body.appendChild(recapModalBackdrop);

    // --- 3. 초기 이벤트 리스너 연결 ---
    const monthSelector = document.getElementById("recap-month-selector");
    populateMonthSelector(monthSelector); // monthSelector를 인자로 전달하여 해당 select 요소에 옵션 채우기

    document.getElementById("recap-modal-close-btn").addEventListener("click", () => {
      recapModalBackdrop.style.display = "none";
    });
    const screenshotBtn = document.getElementById("recap-screenshot-btn");
    // 기본 좌클릭: 프로필 포함하여 스크린샷
    screenshotBtn.addEventListener("click", () => captureScreenshot());

    // 우클릭: 프로필 숨기고 스크린샷
    screenshotBtn.addEventListener("contextmenu", (e) => {
      e.preventDefault(); // 브라우저 기본 우클릭 메뉴 방지
      captureScreenshot({ hideProfile: true }); // hideProfile 옵션을 주어 호출
    });
    recapModalBackdrop.addEventListener("click", (e) => {
      // 모달 배경 클릭 시 닫기
      if (e.target === recapModalBackdrop) {
        recapModalBackdrop.style.display = "none";
      }
    });
    document.getElementById("recap-fetch-button").addEventListener("click", handleFetchButtonClick);
    document.getElementById("recap-export-button").addEventListener("click", handleExportClick);
    document.getElementById("recap-import-input").addEventListener("change", handleImportChange);
    document.getElementById("recap-share-button").addEventListener("click", handleShareClick);
    document.getElementById("recap-verify-button").addEventListener("click", handleVerifyClick);
    document.getElementById("recap-show-verify-button").addEventListener("click", handleShowVerifyClick);

    // 모달을 기본적으로 숨김 상태로 시작
    recapModalBackdrop.style.display = "none";
  }
  function populateMonthSelector(selectorElement) {
    selectorElement.innerHTML = "";
    const today = new Date();
    const limitDate = new Date();
    limitDate.setDate(today.getDate() - 90); // 90일(3개월) 제한

    for (let i = 0; i < 12; i++) {
      // 최대 12개월 전까지
      const dateOption = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const lastDayOfMonth = new Date(dateOption.getFullYear(), dateOption.getMonth() + 1, 0);

      // 현재 날짜로부터 90일 이내의 월만 표시
      if (lastDayOfMonth < limitDate) {
        break;
      }

      const year = dateOption.getFullYear();
      const month = dateOption.getMonth() + 1;
      const option = document.createElement("option");
      option.value = `${year}-${String(month).padStart(2, "0")}`;
      option.textContent = `${year}년 ${month}월`;
      selectorElement.appendChild(option);
    }
  }
  function toggleRecapModule(forceShow = false) {
    // UI가 아직 생성되지 않았다면 안전하게 먼저 생성합니다.
    if (!recapModalBackdrop) {
      customLog.log("Recap module UI not found, creating it now.");
      createRecapModule();
    }

    // 모달의 현재 표시 상태를 확인합니다.
    const isModalVisible = recapModalBackdrop.style.display === "flex";

    if (forceShow || !isModalVisible) {
      // 모달을 열거나 강제로 열어야 하는 경우:
      recapModalBackdrop.style.display = "flex"; // 모달 표시

      // 컨텐츠 영역 초기화 및 로더 숨김
      const wrapper = document.getElementById("recap-content-wrapper");
      const loader = document.getElementById("recap-loader");
      wrapper.innerHTML = `<p style="text-align: center;">조회할 월을 선택하고 '데이터 조회' 버튼을 눌러주세요.</p>`;
      wrapper.style.display = "block";
      loader.style.display = "none";

      // 이전에 생성된 Chart.js 인스턴스가 있다면 모두 파괴하여 메모리 누수 방지
      activeCharts.forEach((chart) => chart.destroy());
      activeCharts = [];
      customLog.log("Recap module opened and initialized.");
    } else {
      // 모달을 닫아야 하는 경우:
      recapModalBackdrop.style.display = "none";
      customLog.log("Recap module closed.");
    }
  }
  function createRecapMenuButton() {
    const targetMenu = document.querySelector("#userArea ul.menuList:nth-child(1)");
    if (!targetMenu || targetMenu.querySelector("a.my_recap")) {
      return;
    }
    if (!document.getElementById("recap-menu-icon-style")) {
      const styleEl = document.createElement("style");
      styleEl.id = "recap-menu-icon-style";
      styleEl.textContent = `
                #userArea .menuList li a.my_recap::before {
                    content: ''; display: inline-block; width: 24px; height: 24px; margin-right: 12px;
                    vertical-align: middle;
                    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%235dade2' d='M4 9h4v11H4zM10 4h4v16h-4zM16 12h4v8h-4z'/%3E%3C/svg%3E");
                    background-position: 50% 50%; background-repeat: no-repeat; background-size: 100% 100%;
                }
            `;
      document.head.appendChild(styleEl);
    }

    const listItem = document.createElement("li");
    const link = document.createElement("a");
    link.href = "#";
    link.className = "my_recap";
    link.innerHTML = "<span>월별 리캡</span>";
    listItem.appendChild(link);
    targetMenu.appendChild(listItem);
  }
  const observeAndAppendRecapButton = async () => {
    document.body.addEventListener(
      "click",
      async (e) => {
        const recapLink = e.target.closest("a.my_recap");
        if (!recapLink) return;

        e.preventDefault();

        if (recapInitialized) {
          // 두번째 이상 실행
          toggleRecapModule();
          return;
        }

        const span = recapLink.querySelector("span");
        const originalText = span.textContent;
        span.textContent = "로딩 중...";

        try {
          // 첫번째 실행
          await loadScript("https://cdn.jsdelivr.net/npm/chart.js");
          await loadScript("https://html2canvas.hertzen.com/dist/html2canvas.min.js");
          await loadScript("https://cdn.jsdelivr.net/npm/canvas-confetti@1/dist/confetti.browser.js");
          createRecapModule();
          recapInitialized = true;
          toggleRecapModule();
        } catch (error) {
          alert("리캡 기능에 필요한 라이브러리를 로드하는 데 실패했습니다.");
          customLog.error("Recap Script Load Error:", error);
        } finally {
          span.textContent = originalText;
        }
      },
      true,
    );

    // --- DOM 변경을 감시하여 버튼이 사라지면 다시 생성하는 로직 ---
    const parentSelector = "#logArea";
    const targetSelector = await waitForElementAsync(parentSelector);
    if (targetSelector) {
      const handleLogAreaChange = async () => {
        const userAreaSelector = await waitForElementAsync("#userArea ul.menuList:nth-child(1)");
        if (userAreaSelector) {
          createRecapMenuButton();
        }
      };
      observeElementChanges(parentSelector, handleLogAreaChange);
    }
  };

  function displayCenterVolume(isMuted, currentVolume) {
    // 필요한 UI 요소들을 찾습니다.
    const centerVolumeText = document.querySelector(".volume_text");
    const centerButton = document.querySelector(".center_btn");
    const centerVolumeIcon = document.querySelector(".volume_icon");

    if (!centerVolumeText || !centerButton || !centerVolumeIcon) {
      customLog.error("중앙 볼륨 표시 UI 요소를 찾을 수 없습니다.");
      return;
    }

    // 상태에 따라 아이콘 클래스와 표시될 텍스트를 결정합니다.
    let t = "";
    isMuted ? (t = "mute") : currentVolume < 0.5 && (t = "low");
    let e = isMuted ? 0 : currentVolume;

    // UI 요소들을 화면에 표시합니다.
    centerVolumeText.textContent = `${Math.round(100 * e)}%`;
    centerVolumeText.classList.remove("hide_text");
    centerButton.classList.remove("fadeOut");
    centerButton.querySelectorAll("div, button").forEach((el) => {
      if (!el.classList.contains("volume_icon")) {
        el.style.display = "none";
      }
    });
    centerVolumeIcon.classList.remove("low", "mute");
    if (t) {
      centerVolumeIcon.classList.add(t);
    }
    centerVolumeIcon.style.display = "block";

    // 0.4초 후에 UI를 다시 숨깁니다.
    setTimeout(() => {
      centerButton.classList.add("fadeOut");
      centerVolumeText.classList.add("hide_text");
      centerVolumeIcon.style.display = "none";
    }, 400);
  }

  // 3.5. 이벤트 핸들러 및 옵저버 (Event Handlers & Observers)
  class PlayerEventMapper {
    constructor(playerElement, videoElement, buttonSelectors) {
      this.player = playerElement;
      this.video = videoElement;
      this.buttons = {};
      this.actions = {};
      this._initializeButtons(buttonSelectors);
    }

    async _initializeButtons(selectors) {
      const buttonEntries = await Promise.all(
        Object.entries(selectors).map(async ([key, selector]) => {
          const element = await waitForElementAsync(selector);
          if (!element) customLog.error(`[EventMapper] '${key}' 버튼을 찾을 수 없습니다. (셀렉터: ${selector})`);
          return [key, element];
        }),
      );

      this.buttons = Object.fromEntries(buttonEntries.filter((entry) => entry[1]));
      this._defineActions();

      customLog.log("[EventMapper] 모든 버튼이 준비되었습니다.", this.buttons);
      this.player.dispatchEvent(new Event("mapper-ready"));
    }

    _defineActions() {
      this.actions = {
        none: () => {
          return;
        },
        toggleMute: () => {
          if (!this.buttons.mute) return;
          this.buttons.mute.click();
          setTimeout(() => {
            displayCenterVolume(this.video.muted, this.video.volume);
          }, 50);
        },
        togglePause: () => {
          if (!this.buttons.pause) return;
          const computedStyle = window.getComputedStyle(this.buttons.pause);
          if (computedStyle.display === "none") {
            return;
          }
          this.buttons.pause.click();
        },
        toggleStop: () => {
          if (!this.buttons.stop) return;
          this.buttons.stop.click();
        },
        toggleScreenMode: () => {
          if (!this.buttons.screenMode) return;
          this.buttons.screenMode.click();
        },
        toggleFullscreen: () => {
          if (!this.buttons.fullscreen) return;
          this.buttons.fullscreen.click();
        },
      };
    }

    // 이벤트를 특정 액션에 매핑하는 핵심 메소드 (키보드 관련 로직 제거됨)
    map(eventType, actionName) {
      if (typeof this.actions[actionName] !== "function") {
        customLog.error(`[EventMapper] '${actionName}'은(는) 유효한 액션이 아닙니다.`);
        return;
      }

      const listener = (event) => {
        // 비디오 영역 클릭 시에만 동작하도록 제한
        if (event.target.id !== "videoLayerCover" && event.target !== this.player) {
          return;
        }
        event.preventDefault(); // 우클릭 메뉴, 더블클릭 선택 등 기본 동작 방지

        // 매핑된 액션 실행
        this.actions[actionName]();
      };

      // 플레이어에 마우스 이벤트 리스너 추가
      this.player.addEventListener(eventType, listener);
    }

    // 설정 객체를 받아와서 모든 매핑을 한 번에 적용 (키보드 관련 로직 제거됨)
    applyConfiguration(config) {
      for (const eventType in config) {
        const actionName = config[eventType];
        this.map(eventType, actionName);
      }
      customLog.log("[EventMapper] 사용자 설정이 적용되었습니다.", config);
    }
  }

  const checkSidebarVisibility = () => {
    let intervalId = null;
    let lastExecutionTime = Date.now(); // 마지막 실행 시점 기록

    const handleVisibilityChange = () => {
      const body = document.body;
      const isScreenmode = body.classList.contains("screen_mode");
      const isShowSidebar = body.classList.contains("showSidebar");
      const isFullScreenmode = body.classList.contains("fullScreen_mode");
      const isSidebarHidden = (isScreenmode ? !isShowSidebar : false) || isFullScreenmode;
      const webplayer = document.getElementById("webplayer");
      const webplayerStyle = webplayer?.style;
      const sidebar = document.getElementById("sidebar");

      // 스크린 모드에서 사이드바 항상 보이는 옵션
      if (webplayer && isScreenmode && showSidebarOnScreenModeAlways && !isShowSidebar) {
        body.classList.add("showSidebar");
        webplayer.style.left = "0px";
        webplayer.style.left = sidebar.offsetWidth + "px";
        webplayer.style.width = `calc(100vw - ${sidebar.offsetWidth}px)`;
      }

      // 사이드바가 보이는 상태에서 스크린 모드 종료할 때
      if (webplayer && !isScreenmode && isShowSidebar) {
        body.classList.remove("showSidebar");
        webplayerStyle.removeProperty("width");
        webplayerStyle.removeProperty("left");
      }

      if (document.visibilityState === "visible" && isSidebarHidden) {
        customLog.log("#sidebar는 숨겨져 있음");
        return;
      }

      const currentTime = Date.now();
      const timeSinceLastExecution = (currentTime - lastExecutionTime) / 1000; // 초 단위로 변환

      if (document.visibilityState === "visible" && timeSinceLastExecution >= 60) {
        customLog.log("탭 활성화됨");
        generateBroadcastElements(1);
        lastExecutionTime = currentTime; // 갱신 시점 기록
        restartInterval(); // 인터벌 재시작
      } else if (document.visibilityState === "visible") {
        customLog.log("60초 미만 경과: 방송 목록 갱신하지 않음");
      } else {
        customLog.log(`탭 비활성화됨: 마지막 갱신 = ${parseInt(timeSinceLastExecution)}초 전`);
      }
    };

    const restartInterval = () => {
      if (intervalId) clearInterval(intervalId); // 기존 인터벌 중단

      intervalId = setInterval(() => {
        handleVisibilityChange();
      }, 60 * 1000); // 60초마다 실행
    };

    (async () => {
      const sidebarDiv = await waitForElementAsync("#sidebar");
      observeClassChanges("body", handleVisibilityChange);
      restartInterval(); // 인터벌 시작
      document.addEventListener("visibilitychange", handleVisibilityChange);
    })();
  };
  const processStreamers = () => {
    const processedLayers = new Set(); // 처리된 레이어를 추적

    // [수정 1] 숨기기 버튼 생성 (기존 유지)
    const createHideButton = (listItem, optionsLayer) => {
      const hideButton = document.createElement("button"); // "숨기기" 버튼 생성
      hideButton.type = "button";
      const span = document.createElement("span");
      span.textContent = "이 브라우저에서 스트리머 숨기기";
      hideButton.appendChild(span);

      // 클릭 이벤트 추가
      hideButton.addEventListener("click", () => {
        const userNameElement = listItem.querySelector("a.nick > span"); // 사용자 이름 요소
        const userIdElement = listItem.querySelector(".cBox-info > a"); // 사용자 ID 요소

        if (userNameElement && userIdElement) {
          const userId = userIdElement.href.split("/")[4]; // 사용자 ID 추출
          const userName = userNameElement.innerText; // 사용자 이름 추출
          customLog.log(`Blocking user: ${userName}, ID: ${userId}`); // 로그 추가

          if (userId && userName) {
            blockUser(userName, userId); // 사용자 차단 함수 호출
            listItem.style.display = "none";
          }
        } else {
          customLog.log("User elements not found."); // 요소가 없을 경우 로그 추가
        }
      });
      optionsLayer.appendChild(hideButton); // 옵션 레이어에 버튼 추가
    };

    // [수정 2] 카테고리 숨기기 버튼 (기능 끄기 위해 내용 비움 -> 에러 방지)
    const createCategoryHideButton = (listItem, optionsLayer) => {
      return;
    };

    // [수정 3] 핀 버튼 (기능 끄기 위해 내용 비움 -> 에러 방지)
    const createCategoryPinButton = (listItem, optionsLayer) => {
      return;
    };

    // [수정 4] DOM 변경 감지 (렉 방지 최적화 적용됨)
    const handleDOMChange = (mutationsList) => {
      let shouldUpdate = false;

      // 1. 변화가 있는지 빠르게 스캔
      for (const mutation of mutationsList) {
        if (mutation.type === "childList") {
          shouldUpdate = true;
        }
      }

      // 2. 변화가 있을 때만 딱 한 번 실행 (렉 해결 핵심)
      if (shouldUpdate) {
        // (A) 더보기 메뉴 버튼 처리
        const moreOptionsContainer = document.querySelector("div._moreDot_wrapper");
        const optionsLayer = moreOptionsContainer ? moreOptionsContainer.querySelector("div._moreDot_layer") : null;

        if (optionsLayer && optionsLayer.style.display !== "none" && !processedLayers.has(optionsLayer)) {
          const activeButton = document.querySelector("button.more_dot.on");
          const listItem = activeButton ? activeButton.closest('li[data-type="cBox"]') : null;

          if (listItem) {
            createHideButton(listItem, optionsLayer); // 숨기기 버튼 생성
            createCategoryHideButton(listItem, optionsLayer);
            createCategoryPinButton(listItem, optionsLayer); // Add the pin button
            processedLayers.add(optionsLayer); // 이미 처리된 레이어로 추가
          }
        } else if (!optionsLayer) {
          processedLayers.clear(); // 요소가 없을 때 처리된 레이어 초기화
        }

        // (B) 방송 목록 필터링
        const cBoxListItems = document.querySelectorAll('div.cBox-list li[data-type="cBox"]:not(.hide-checked)');

        for (const listItem of cBoxListItems) {
          listItem.classList.add("hide-checked");

          const userIdElement = listItem.querySelector(".cBox-info > a"); // 사용자 ID 요소
          const categoryElements = listItem.querySelectorAll(".cBox-info .tag_wrap a.category"); // 다중 카테고리
          const tagElements = listItem.querySelectorAll(".cBox-info .tag_wrap a:not(.category)");
          const titleElement = listItem.querySelector(".cBox-info .title a");

          // 유저 차단
          if (userIdElement) {
            const userId = userIdElement.href.split("/")[4];
            if (isUserBlocked(userId)) {
              // 차단된 사용자일 경우 li 삭제
              listItem.style.display = "none";
              customLog.log(`Removed blocked user with ID: ${userId}`); // 로그 추가
            }
          }

          // 카테고리 차단 (다중)
          if (categoryElements) {
            for (const categoryElement of categoryElements) {
              const categoryName = categoryElement.textContent;
              if (isCategoryBlocked(getCategoryNo(categoryName))) {
                listItem.style.display = "none";
                customLog.log(`Removed blocked category with Name: ${categoryName}`); // 로그 추가
                break;
              }
            }
          }

          // 제목 차단
          if (titleElement) {
            const broadTitle = titleElement.textContent;
            for (const word of blockedWords) {
              if (broadTitle.toLowerCase().includes(word.toLowerCase())) {
                listItem.style.display = "none";
                customLog.log(`Removed item with blocked word in title: ${broadTitle}`); // 로그 추가
                break;
              }
            }
          }

          // 태그 차단
          if (tagElements) {
            for (const tagElement of tagElements) {
              const tagTitle = tagElement.textContent;
              // blockedWords에 포함된 단어가 broadTitle에 있는지 체크
              for (const word of blockedWords) {
                if (tagTitle.toLowerCase().includes(word.toLowerCase())) {
                  listItem.style.display = "none";
                  customLog.log(`Removed item with blocked word in tag: ${tagTitle}`); // 로그 추가
                  break; // 하나의 차단 단어가 발견되면 더 이상 확인할 필요 없음
                }
              }
              if (listItem.style.display === "none") break;
            }
          }
        }

        // (C) 썸네일 처리 (프리뷰, 19금 등)
        if (isPreviewModalEnabled) {
          const allThumbsBoxLinks = document.querySelectorAll('[data-type=cBox] .thumbs-box > a[href]:not([href^="https://vod.sooplive.co.kr"])');
          if (allThumbsBoxLinks.length) previewModalManager.attachToThumbnails(allThumbsBoxLinks);
        }

        // [수정됨] 19금 썸네일 호출부
        if (isReplaceEmptyThumbnailEnabled) {
          // 화면에 연령제한 배지가 하나라도 있으면 함수 실행
          // (함수 내부에서 '마우스 오버 이벤트'를 부착하는 작업을 수행함)
          if (document.querySelector(".status.adult")) {
            replaceThumbnails();
          }
        }

        // 새 탭 방지
        if (!isOpenNewtabEnabled) {
          setTimeout(removeTargetFromLinks, 100);
        }
      }
    };

    const observer = new MutationObserver(handleDOMChange); // DOM 변경 감지기
    const config = { childList: true, subtree: true };
    observer.observe(document.body, config);
  };

  /**
   * 채팅 메시지를 추적하고, 강퇴/지정 유저 메시지를 모달에 표시하는 함수
   */
  const setupChatMessageTrackers = (element) => {
    const OriginalWebSocket = window.WebSocket;
    const targetUrlPattern = /^wss:\/\/chat-[\w\d]+\.sooplive\.co\.kr/;
    const MAX_MESSAGES = 500;

    const messageHistory = [];
    const bannedMessages = [];
    const targetUserMessages = [];

    const recentChatContents = [];
    const RECENT_CHAT_LIMIT = 10;

    let bannedModal = null;
    let targetModal = null;
    let banIcon = null;
    let highlightIcon = null;

    let totalChatCount = 0;
    let lastChatCount = 0;
    let last10Intervals = [];

    if (isChatCounterEnabled) {
      const container = document.querySelector(".chatting-item-wrap");
      const cpsDisplay = document.createElement("div");
      cpsDisplay.id = "cps_display";
      container.appendChild(cpsDisplay);
      Object.assign(cpsDisplay.style, {
        position: "absolute",
        top: "8px",
        left: "8px",
        background: "rgba(0, 0, 0, 0.3)",
        color: "#fff",
        fontSize: "14px",
        padding: "4px 8px",
        borderRadius: "4px",
        zIndex: "10",
        pointerEvents: "none",
      });
      setInterval(() => {
        const delta = totalChatCount - lastChatCount;
        lastChatCount = totalChatCount;
        last10Intervals.push(delta);
        if (last10Intervals.length > 10) {
          last10Intervals.shift();
        }
        const sum = last10Intervals.reduce((a, b) => a + b, 0);
        const avg = sum / 5;
        cpsDisplay.textContent = `${Math.round(avg)}개/s`;
      }, 500);
    }

    GM_addStyle(`
        /* 모달 내부 메시지 리스트 스타일 (수정됨) */
        .message-list_23423 {
            list-style: none;
            padding: 4px;
            margin: 0;
        }
        .message-list_23423 li {
            display: grid; /* [변경] flex에서 grid로 변경 */
            grid-template-columns: 65px 24px 1fr; /* [추가] 시간, 프사, 내용 영역 분할 */
            gap: 0 8px; /* 열 사이 간격 */
            align-items: flex-start;
            padding: 4px 4px;
            border-radius: 4px;
            line-height: 1.5;
        }
        .message-list_23423 li:hover {
            background-color: #3a3a3d;
        }
        .message-list_23423 .no-message {
            display: block;
            color: #888;
            text-align: center;
            padding: 20px;
            background-color: transparent;
        }
        .message-list_23423 .timestamp {
            color: #a9a9b3;
            font-size: 15px;
            margin-top: 2px;
        }
        /* [추가] 프로필 사진 스타일 */
        .message-list_23423 .profile-pic {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            object-fit: cover;
        }
        .message-list_23423 .content-wrap {
            word-break: break-all;
            color: #dcdcdc;
            font-size: 16px;
        }
        .message-list_23423 .username-link {
            text-decoration: none;
            color: inherit;
            margin-right: 6px;
        }
        .message-list_23423 .username-link:hover .username {
            text-decoration: underline;
        }
        .message-list_23423 .username {
            font-weight: bold;
            font-size: 16px;
        }
        .message-list_23423 .message {
            font-size: 16px;
        }
        /* [변경] 강퇴 메시지는 grid를 사용하지 않도록 별도 처리 */
        .message-list_23423 li.special-activity {
            display: flex; /* grid 대신 flex 유지 */
            gap: 0 12px;
        }
        .message-list_23423 li.special-activity .content-wrap {
            font-style: italic;
        }
    `);

    if (isShowDeletedMessagesEnabled) {
      bannedModal = new DraggableResizableModal("banned-messages-modal", "강제퇴장된 유저의 채팅", { top: "100px", right: "100px" });
      bannedModal.getContentElement().innerHTML = '<ul id="bannedMessagesList" class="message-list_23423"><li class="no-message">메시지가 없습니다.</li></ul>';
    }
    if (isShowSelectedMessagesEnabled) {
      const initialTitle = `채팅 모아보기 (즐찾 ${allFollowUserIds.length}명, 수동 ${selectedUsersArray.length}명${isCheckBestStreamersListEnabled ? `, 베스 ${bestStreamersList.length}명` : ""})`;
      targetModal = new DraggableResizableModal("target-messages-modal", initialTitle, { top: "150px", right: "150px" });
      targetModal.getContentElement().innerHTML = '<ul id="targetUserMessagesList" class="message-list_23423"><li class="no-message">메시지가 없습니다.</li></ul>';
    }

    const toggleRedDot = (icon, shouldShow) => {
      if (!icon) return;
      let redDot = icon.querySelector(".red-dot");
      if (shouldShow && !redDot) {
        redDot = document.createElement("div");
        redDot.className = "red-dot";
        Object.assign(redDot.style, { position: "absolute", top: "0px", right: "0px", width: "4px", height: "4px", borderRadius: "50%", backgroundColor: "red", zIndex: 1001 });
        icon.appendChild(redDot);
      } else if (!shouldShow && redDot) {
        redDot.remove();
      }
    };
    /**
     * 사용자 ID를 기반으로 일관된 HSL 색상을 생성합니다.
     * @param {string} str - 사용자 ID
     * @param {number} s - 채도 (Saturation)
     * @param {number} l - 명도 (Lightness)
     * @returns {string} HSL 색상 문자열
     */
    const stringToHslColor = (str, s = 70, l = 75) => {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
      }
      const h = hash % 360;
      return `hsl(${h}, ${s}%, ${l}%)`;
    };
    /**
     * [수정됨] 메시지를 DOM에 추가하고 지능적으로 스크롤합니다.
     * @param {HTMLElement} messageList - 메시지가 추가될 <ul> 요소
     * @param {object} msg - 메시지 객체
     * @param {HTMLElement} scrollContainer - 스크롤이 있는 부모 컨테이너
     * @param {boolean} isBannedList - 강퇴 리스트 여부
     */
    const addMessageToDOM = (messageList, msg, scrollContainer, isBannedList = false) => {
      const noMessageItem = messageList.querySelector(".no-message");
      if (noMessageItem) noMessageItem.remove();

      const threshold = 20;
      const isScrolledToBottom = scrollContainer.scrollHeight - scrollContainer.clientHeight <= scrollContainer.scrollTop + threshold;

      const listItem = document.createElement("li");
      const timestampText = `[${msg.timestamp}]`.replace(/[\[\]]/g, "");

      const systemMessage = msg.message === `[강제퇴장 됨]`;

      if (systemMessage) {
        // 강퇴 메시지는 grid 레이아웃을 사용하지 않도록 special-activity 클래스 추가
        listItem.classList.add("special-activity");
        listItem.innerHTML = `
                <span class="timestamp">${timestampText}</span>
                <div class="content-wrap">${msg.userName} (${msg.userId}) 님이 강제 퇴장 되었습니다.</div>
            `;
      } else {
        const userColor = stringToHslColor(msg.userId);
        const profileImgUrl = `https://profile.img.sooplive.co.kr/LOGO/${msg.userId.substring(0, 2)}/${msg.userId}/${msg.userId}.jpg`;

        listItem.innerHTML = `
                <span class="timestamp">${timestampText}</span>
                <img class="profile-pic" src="${profileImgUrl}" alt="profile" title="${msg.userId}" onerror="this.style.visibility='hidden'">
                <div class="content-wrap">
                    <a class="username-link" href="https://ch.sooplive.co.kr/${msg.userId}" target="_blank" title="채널 방문: ${msg.userId}">
                        <span class="username" style="color: ${userColor};">${msg.userName}</span>
                    </a>
                    <span class="message">${msg.message}</span>
                </div>`;
      }

      messageList.appendChild(listItem);

      if (isScrolledToBottom) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    };

    const recordMessage = (userId, userName, message, timestamp) => {
      const msgData = { userId, userName, message, timestamp };
      messageHistory.push(msgData);
      if (messageHistory.length > MAX_MESSAGES) messageHistory.shift();

      if (isShowSelectedMessagesEnabled && targetUserIdSet.has(userId)) {
        targetUserMessages.push(msgData);
        if (targetModal) {
          const scrollContainer = targetModal.getContentElement();
          const messageList = scrollContainer.querySelector("#targetUserMessagesList");
          addMessageToDOM(messageList, msgData, scrollContainer, false);
        }
        if (!targetModal?.isVisible()) toggleRedDot(highlightIcon, true);
      }
    };

    const decodeMessage = (data) => {
      const decoder = new TextDecoder("utf-8");
      const decodedText = decoder.decode(data);
      const parts = decodedText.split("\x0c");
      const now = new Date();
      const timestamp = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}`;
      const streamerId = location.href.split("/")[3];
      const partHeader = parts[0].split("\u001b\t")[1];

      if (parts.length < 20) {
        // 일반 채팅
        if (partHeader.startsWith("0005000")) {
          const userId = parts[2].split("(")[0];
          const userName = parts[6];
          const message = parts[1];
          recordMessage(userId, userName, message, timestamp);
          //customLog.log(partHeader, parts);
          //customLog.log('일반채팅',userId, userName, message, timestamp);
        } else if (partHeader.startsWith("001800")) {
          // 별풍선
          const userId = parts[2].split("(")[0];
          const userName = parts[3];
          const message = `🎈 별풍선 ${parts[4]}개`;
          recordMessage(userId, userName, message, timestamp);
          //customLog.log(partHeader, parts);
          customLog.log(parts.length, "별풍선", userId, userName, message, timestamp);
        } else if (partHeader.startsWith("0105000")) {
          // 영상풍선
          const userId = parts[3].split("(")[0];
          const userName = parts[4];
          const message = `🎈 영상풍선 ${parts[5]}개`;
          recordMessage(userId, userName, message, timestamp);
          //customLog.log(partHeader, parts);
          customLog.log(parts.length, "영상풍선", userId, userName, message, timestamp);
        } else if (partHeader.startsWith("008700")) {
          // 애드벌룬
          const userId = parts[3].split("(")[0];
          const userName = parts[4];
          const message = `🎈 애드벌룬 ${parts[10]}개`;
          recordMessage(userId, userName, message, timestamp);
          //customLog.log(partHeader, parts);
          customLog.log(parts.length, "애드벌룬", userId, userName, message, timestamp);
        } else if (partHeader.startsWith("012100")) {
          // 대결미션, 도전미션
          const jsonResponse = JSON.parse(parts[1]);
          const userId = jsonResponse?.user_id;
          const userName = jsonResponse?.user_nick;
          const message = `🎈 미션풍선 ${jsonResponse?.gift_count}개`;
          recordMessage(userId, userName, message, timestamp);
          //customLog.log(partHeader, parts);
          customLog.log(parts.length, "미션풍선", userId, userName, message, timestamp);
        } else if (partHeader.startsWith("000400") && parts[1] === "-1" && parts[4] === "2") {
          const userId = parts[2].split("(")[0],
            userName = parts[3];
          if (userId.includes("|") || userName.includes("|") || !userId || !userName) return;
          if (isShowDeletedMessagesEnabled) {
            const userMessages = messageHistory.filter((msg) => msg.userId === userId);
            const banNotice = { userId, userName, message: "[강제퇴장 됨]", timestamp };
            const messagesToAdd = [...userMessages, banNotice];
            bannedMessages.push(...messagesToAdd);
            //customLog.log(partHeader, parts);
            customLog.log(parts.length, partHeader, banNotice);
            if (bannedModal) {
              const scrollContainer = bannedModal.getContentElement();
              const messageList = scrollContainer.querySelector("#bannedMessagesList");
              messagesToAdd.forEach((msg) => {
                addMessageToDOM(messageList, msg, scrollContainer, true);
              });
            }
            if (!bannedModal?.isVisible()) toggleRedDot(banIcon, true);
          }
        } else {
          customLog.log(partHeader, parts);
        }
        if (isChatCounterEnabled) totalChatCount++;
      }
    };

    const shouldBlockMessage = (data) => {
      if (!isBlockWordsEnabled && !isHideDuplicateChatEnabled) return false;
      try {
        const text = new TextDecoder("utf-8").decode(data);
        const parts = text.split("\x0c");
        const partHeader = parts[0].split("\u001b\t")[1];

        if (parts.length === 13 || parts.length === 14) {
          if (partHeader.startsWith("0005000")) {
            // 일반 채팅
            const messageText = parts[1];
            if (!messageText) return false;

            if (isBlockWordsEnabled && checkMessageForBlocking(messageText)) {
              customLog.log("차단 단어 포함:", messageText);
              return true;
            }

            if (isHideDuplicateChatEnabled) {
              if (recentChatContents.includes(messageText)) {
                customLog.log("중복 채팅 감지:", messageText);
                return true;
              }
              recentChatContents.push(messageText);
              if (recentChatContents.length > RECENT_CHAT_LIMIT) {
                recentChatContents.shift();
              }
            }
          }
        }
      } catch (e) {
        customLog.warn("메시지 디코딩 실패:", e);
      }
      return false;
    };

    unsafeWindow.WebSocket = function (url, protocols) {
      const ws = new OriginalWebSocket(url, protocols);

      if (targetUrlPattern.test(url)) {
        ws.addEventListener(
          "message",
          (event) => {
            decodeMessage(event.data);

            if (shouldBlockMessage(event.data)) {
              event.stopImmediatePropagation();
            }
          },
          true,
        );
      }

      return ws;
    };
    unsafeWindow.WebSocket.prototype = OriginalWebSocket.prototype;

    const createIcon = (type, onClick) => {
      const icon = document.createElement("div");
      icon.className = `chat-icon ${type === "highlight" ? "highlight-icon" : "trash-icon"} ${type}`;
      icon.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick();
      });
      element.appendChild(icon);
      return icon;
    };

    const showBannedMessages = () => {
      if (!bannedModal) return;
      if (bannedModal.isVisible()) {
        bannedModal.hide();
      } else {
        toggleRedDot(banIcon, false);
        bannedModal.show();
      }
    };

    const showTargetMessages = () => {
      if (!targetModal) return;
      if (targetModal.isVisible()) {
        targetModal.hide();
      } else {
        toggleRedDot(highlightIcon, false);
        const newTitle = `채팅 모아보기 (즐찾 ${allFollowUserIds.length}명, 수동 ${selectedUsersArray.length}명${isCheckBestStreamersListEnabled ? `, 베스 ${bestStreamersList.length}명` : ""})`;
        targetModal.setTitle(newTitle);
        targetModal.show();
      }
    };

    const resetChatData = () => {
      messageHistory.length = bannedMessages.length = targetUserMessages.length = 0;
      recentChatContents.length = 0;
      if (bannedModal) {
        bannedModal.getContentElement().querySelector("#bannedMessagesList").innerHTML = '<li class="no-message">메시지가 없습니다.</li>';
      }
      if (targetModal) {
        targetModal.getContentElement().querySelector("#targetUserMessagesList").innerHTML = '<li class="no-message">메시지가 없습니다.</li>';
      }
      toggleRedDot(banIcon, false);
      toggleRedDot(highlightIcon, false);
    };

    unsafeWindow.resetChatData = resetChatData;

    if (isShowDeletedMessagesEnabled) banIcon = createIcon("trash", showBannedMessages);
    if (isShowSelectedMessagesEnabled) highlightIcon = createIcon("highlight", showTargetMessages);
  };

  // VOD 전용 채팅 단어 차단
  const observeChatForBlockingWords = (elementSelector, elem) => {
    if (!isBlockWordsEnabled || !REG_WORDS || REG_WORDS.length === 0) {
      return;
    }

    const observer = new MutationObserver((mutations) => {
      // 발생한 모든 변화(mutation)를 순회합니다.
      mutations.forEach(({ addedNodes }) => {
        // 각 변화에서 추가된 노드(addedNodes)들을 순회합니다.
        addedNodes.forEach((node) => {
          // 추가된 노드가 HTML 요소가 아니면 건너뜁니다.
          if (node.nodeType !== Node.ELEMENT_NODE) return;

          const messages = node.querySelectorAll("div.message-text > p.msg");

          if (messages.length === 0) return;

          // 찾은 모든 메시지(NodeList)에 대해 차단 여부를 확인합니다.
          messages.forEach((messageElement) => {
            const messageText = messageElement.textContent.trim();

            if (checkMessageForBlocking(messageText)) {
              const listItem = messageElement.closest(".chatting-list-item");
              if (listItem) {
                customLog.log(messageElement.innerText);
                listItem.remove();
              }
            }
          });
        });
      });
    });

    // 지정된 요소(elem)에 대해 자식 노드 추가/제거 및 하위 트리 전체를 감시합니다.
    observer.observe(elem, { childList: true, subtree: true });
  };

  // 전역 변수 영역에 추가
  let blockWordsRegex = null;
  let exactBlockWords = new Set();

  // 채팅 단어 차단 관련 로직이 활성화 될 때 아래 함수를 호출하여 정규식을 미리 생성합니다.
  const compileBlockRules = () => {
    if (!isBlockWordsEnabled || REG_WORDS.length === 0) {
      blockWordsRegex = null;
      exactBlockWords.clear();
      return;
    }

    const containWords = [];
    exactBlockWords.clear();

    // 'e:' 접두사에 따라 단어를 분리
    REG_WORDS.forEach((word) => {
      if (word.startsWith("e:")) {
        exactBlockWords.add(word.slice(2));
      } else if (word) {
        // 정규식에 안전한 형태로 단어 변환
        containWords.push(word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
      }
    });

    // '포함' 단어들에 대한 정규식 생성 (하나라도 있으면)
    if (containWords.length > 0) {
      blockWordsRegex = new RegExp(containWords.join("|"), "i"); // i 플래그로 대소문자 무시
    } else {
      blockWordsRegex = null;
    }
  };

  // shouldBlockMessage 또는 deleteMessages 함수 내부의 확인 로직을 아래와 같이 변경
  const checkMessageForBlocking = (messageText) => {
    if (!isBlockWordsEnabled) return false;

    // 1. 정확히 일치하는 단어 확인 (Set을 사용해 더 빠름)
    if (exactBlockWords.has(messageText)) {
      return true;
    }

    // 2. 포함하는 단어 확인 (정규식 사용)
    if (blockWordsRegex && blockWordsRegex.test(messageText)) {
      return true;
    }

    return false;
  };

  const showSidebarOnMouseOver = () => {
    const sidebar = document.getElementById("sidebar");
    const videoLayer = document.getElementById("player");
    const webplayerContents = document.getElementById("webplayer");
    const body = document.body;
    webplayerContents.style.left = "0px";
    webplayerContents.style.width = "100vw";

    const handleSidebarMouseOver = () => {
      if (body.classList.contains("screen_mode") && !body.classList.contains("showSidebar")) {
        body.classList.add("showSidebar");
        webplayerContents.style.left = sidebar.offsetWidth + "px";
        webplayerContents.style.width = `calc(100vw - ${sidebar.offsetWidth}px)`;
      }
    };

    const handleSidebarMouseOut = () => {
      if (body.classList.contains("screen_mode") && body.classList.contains("showSidebar")) {
        body.classList.remove("showSidebar");
        webplayerContents.style.left = "0px";
        webplayerContents.style.width = "100vw";
      }
    };

    const mouseMoveHandler = (event) => {
      const mouseX = event.clientX;
      const mouseY = event.clientY;

      if (!body.classList.contains("showSidebar")) {
        // videoLayer 기반 높이 50%와 전체 창 높이의 25% 중 더 작은 값을 사용합니다.
        const triggerHeight = Math.min(videoLayer.clientHeight / 2, window.innerHeight / 4);

        if (mouseX < 52 && mouseY > 100 && mouseY < triggerHeight) {
          handleSidebarMouseOver();
        }
      } else {
        if (mouseX < sidebar.clientWidth && mouseY < sidebar.clientHeight) {
          handleSidebarMouseOver();
        } else {
          handleSidebarMouseOut();
        }
      }
    };

    const windowMouseOutHandler = (event) => {
      if (!event.relatedTarget && !event.toElement) {
        handleSidebarMouseOut();
      }
    };

    document.addEventListener("mousemove", mouseMoveHandler);
    window.addEventListener("mouseout", windowMouseOutHandler); // 창 벗어남 감지
  };

  const setupKeydownHandler = (targetCode, toggleFunction) => {
    document.addEventListener(
      "keydown",
      (event) => {
        if (event.code === targetCode && !isUserTyping()) {
          toggleFunction();
        }
      },
      true,
    );
  };
  const toggleExpandChatShortcut = () => {
    setupKeydownHandler("KeyX", toggleExpandChat); // X 키
  };
  const toggleSharpModeShortcut = () => {
    setupKeydownHandler("KeyE", togglesharpModeCheck); // E 키
    updateLabel("clear_screen", "선명한 모드", "선명한 모드(e)");
  };
  const toggleLowLatencyShortcut = () => {
    setupKeydownHandler("KeyD", toggleDelayCheck); // D 키
    updateLabel("delay_check", "시차 단축", "시차 단축(d)");
  };
  const updateLabel = (forId, oldText, newText) => {
    const labelElement = document.body.querySelector(`#player label[for="${forId}"]`);
    if (labelElement) {
      labelElement.innerHTML = labelElement.innerHTML.replace(oldText, newText);
    } else {
      customLog.error("Label element not found.");
    }
  };
  const toggleExpandChat = async () => {
    if (!isElementVisible(".expand-toggle-li")) return;

    try {
      const toggleLink = await waitForElementAsync(".expand-toggle-li a");
      toggleLink.click();
    } catch (error) {
      customLog.error("채팅 확장 토글 링크 클릭 실패:", error);
    }
  };
  const togglesharpModeCheck = () => {
    const sharpModeCheckElement = document.getElementById("clear_screen");
    if (sharpModeCheckElement) {
      sharpModeCheckElement.click();
      showPlayerBar("quality_box");
    }
  };
  const toggleDelayCheck = () => {
    if (isAdjustDelayNoGridEnabled) {
      moveToLatestBufferedPoint();
    } else {
      const delayCheckElement = document.getElementById("delay_check");
      if (delayCheckElement) {
        delayCheckElement.click();
        showPlayerBar("setting_box");
      }
    }
  };
  const showPlayerBar = (target) => {
    const player = document.getElementById("player");
    player.classList.add("mouseover");

    let settingButton, settingBoxOn;
    if (target === "quality_box") {
      settingButton = document.body.querySelector("#player button.btn_quality_mode");
      settingBoxOn = document.body.querySelector(".quality_box.on");
    } else if (target === "setting_box") {
      settingButton = document.body.querySelector("#player button.btn_setting");
      settingBoxOn = document.body.querySelector(".setting_box.on");
    }

    if (settingButton) {
      if (!settingBoxOn) {
        settingButton.click();
      }
      setTimeout(() => {
        // 현재 열려있는(on 클래스를 가진) 설정 박스를 찾습니다.
        const openBox = document.body.querySelector(".quality_box.on, .setting_box.on");
        // 만약 있다면 .on 클래스를 제거합니다.
        if (openBox) {
          openBox.classList.remove("on");
        }

        player.classList.remove("mouseover"); // 이 코드는 그대로 유지합니다.
      }, 1500);
    } else {
      // 버튼을 못 찾았더라도 mouseover는 제거해줍니다.
      setTimeout(() => {
        player.classList.remove("mouseover");
      }, 1500);
      customLog.error("Setting button not found or not visible.");
    }
  };
  const moveToLatestBufferedPoint = () => {
    const video = document.querySelector("video");
    const buffered = video.buffered;

    if (buffered.length > 0) {
      // 버퍼링된 구간의 마지막 시간
      const bufferedEnd = buffered.end(buffered.length - 1);
      const targetTime = bufferedEnd - 2; // 2초 전으로 설정

      // targetTime이 현재 시간보다 뒤에 있을 경우에만 이동
      if (targetTime > video.currentTime) {
        video.currentTime = targetTime;
      }
    }
  };
  const checkPlayerPageHeaderAd = async () => {
    try {
      const headerAd = await waitForElementAsync("#header_ad", 5000);
      headerAd.remove();
    } catch (error) {
      customLog.info("헤더 광고가 없습니다. (정상)");
    }
  };
  const getRemainingBufferTime = (video) => {
    const buffered = video.buffered;
    if (buffered.length > 0) {
      // 마지막 버퍼의 끝과 현재 시간의 차이를 계산
      const remainingBufferTime = buffered.end(buffered.length - 1) - video.currentTime;

      // 0초 또는 정수일 경우 소수점 한 자리로 반환
      return remainingBufferTime >= 0 ? remainingBufferTime.toFixed(remainingBufferTime % 1 === 0 ? 0 : 1) : "";
    }
    return ""; // 버퍼가 없으면 빈 문자열 반환
  };
  const insertRemainingBuffer = (element) => {
    const video = element;
    const emptyChat = document.body.querySelector("#empty_chat");

    // video의 onprogress 이벤트 핸들러
    video.onprogress = () => {
      const remainingBufferTime = getRemainingBufferTime(video); // remainingBufferTime 계산
      if (emptyChat && remainingBufferTime !== "") {
        emptyChat.innerText = `${remainingBufferTime}s 지연됨`;
      }
    };
  };
  const isVideoInPiPMode = () => {
    const videoElement = document.body.querySelector("video");
    return videoElement && document.pictureInPictureElement === videoElement;
  };
  const handleMuteByVisibility = () => {
    if (!isAutoChangeMuteEnabled || isVideoInPiPMode()) return;

    const button = document.body.querySelector("#btn_sound");

    if (document.hidden) {
      // 탭이 비활성화됨
      if (!button.classList.contains("mute")) {
        button.click();
        customLog.log("탭이 비활성화됨, 음소거");
      }
    } else {
      // 탭이 활성화됨
      if (button.classList.contains("mute")) {
        button.click();
        customLog.log("탭이 활성화됨, 음소거 해제");
      }
    }
  };
  const registerVisibilityChangeHandler = () => {
    document.addEventListener("visibilitychange", handleMuteByVisibility, true);
  };
  const handleVisibilityChangeForQuality = async () => {
    if (!isAutoChangeQualityEnabled || isVideoInPiPMode()) return;

    if (document.hidden) {
      customLog.log("[탭 상태] 비활성화됨");

      previousQualityBeforeDowngrade = getCurrentInternalQuality();
      previousIsAutoMode = getIsAutoQualityMode();

      if (!previousQualityBeforeDowngrade) {
        customLog.warn("[현재 화질] 정보를 가져오지 못함");
      } else {
        customLog.log(`[현재 화질 저장] ${previousQualityBeforeDowngrade} (자동모드: ${previousIsAutoMode})`);
      }

      qualityChangeTimeout = setTimeout(async () => {
        await changeQualityLivePlayer("LOW"); // LOW = 최저화질
        didChangeToLowest = true;
        customLog.log("[타이머 실행] 최저화질로 전환됨");
      }, 6500);

      customLog.log("[타이머] 몇 초 후 최저화질로 변경 예약됨");
    } else {
      customLog.log("[탭 상태] 활성화됨");

      if (qualityChangeTimeout) {
        clearTimeout(qualityChangeTimeout);
        qualityChangeTimeout = null;
        customLog.log("[타이머] 예약된 최저화질 변경 취소됨");
      }

      if (didChangeToLowest && previousQualityBeforeDowngrade) {
        const current = getCurrentInternalQuality();
        if (previousIsAutoMode) {
          if (getIsAutoQualityMode()) {
            customLog.log("[복귀] 이미 자동 모드이므로 변경 생략");
          } else {
            await changeQualityLivePlayer("AUTO");
            customLog.log("[복귀] 자동 모드 복원됨");
          }
        } else {
          if (current === previousQualityBeforeDowngrade) {
            customLog.log(`[복귀] 현재 화질(${current})과 동일하여 복원 생략`);
          } else {
            await changeQualityLivePlayer(previousQualityBeforeDowngrade);
            customLog.log(`[복귀] 수동 화질 복원됨 → ${previousQualityBeforeDowngrade}`);
          }
        }
      } else {
        customLog.log("[복귀] 화질 변경 없었으므로 복원 생략");
      }

      // 상태 초기화
      didChangeToLowest = false;
      previousQualityBeforeDowngrade = null;
      previousIsAutoMode = null;
    }
  };
  const registerVisibilityChangeHandlerForQuality = () => {
    document.addEventListener("visibilitychange", handleVisibilityChangeForQuality, true);
  };
  const autoClaimGem = () => {
    const element = document.querySelector("#actionbox > div.ic_gem");
    if (element && getComputedStyle(element).display !== "none") {
      element.click();
    }
  };
  const videoSkipHandler = (e) => {
    const activeElement = document.activeElement;
    const tagName = activeElement.tagName.toLowerCase();

    // 입력란 활성화 여부 체크
    const isInputActive = tagName === "input" || tagName === "textarea" || activeElement.id === "write_area" || activeElement.contentEditable === "true";

    // 입력란이 활성화되어 있지 않은 경우 비디오 제어
    if (!isInputActive) {
      const video = document.querySelector("video");
      if (video) {
        switch (e.code) {
          case "ArrowRight":
            // 오른쪽 방향키: 동영상을 1초 앞으로 이동
            video.currentTime += 1;
            break;
          case "ArrowLeft":
            // 왼쪽 방향키: 동영상을 1초 뒤로 이동
            video.currentTime -= 1;
            break;
        }
      }
    }
  };
  const homePageCurrentTab = async () => {
    try {
      const logoLink = await waitForElementAsync("#logo > a");
      logoLink.removeAttribute("target");
    } catch (error) {
      customLog.error("로고 링크 처리 실패:", error);
    }
  };
  const useBottomChat = () => {
    const toggleBottomChat = () => {
      const playerArea = document.querySelector("#player_area");
      if (!playerArea) {
        customLog.warn("#player_area 요소를 찾을 수 없습니다.");
        return;
      }

      const playerHeight = playerArea.getBoundingClientRect().height;
      const browserHeight = window.innerHeight;

      const isPortrait = window.innerHeight * 1.1 > window.innerWidth;

      document.body.classList.toggle("bottomChat", isPortrait);
    };

    window.addEventListener("resize", debounce(toggleBottomChat, 500));
    toggleBottomChat();
  };
  const getViewersNumber = (raw = false) => {
    const element = document.querySelector("#nAllViewer");

    if (!element) return "0";

    const rawNumber = element.innerText.replace(/,/g, "").trim();

    if (Boolean(raw)) {
      return rawNumber;
    }

    return addNumberSeparator(rawNumber);
  };
  const updateTitleWithViewers = () => {
    const originalTitle = document.title.split(" ")[0]; // 기존 제목의 첫 번째 단어
    const viewers = getViewersNumber(true); // 현재 시청자 수 갱신
    const formattedViewers = addNumberSeparatorAll(viewers); // 형식화된 시청자 수
    let title = originalTitle;

    if (originalTitle !== previousTitle) {
      previousViewers = 0; // 제목이 변경되면 이전 시청자 수 초기화
    }

    if (viewers && previousViewers) {
      if (viewers > previousViewers) {
        title += ` 🔺${formattedViewers}`;
      } else if (viewers < previousViewers) {
        title += ` 🔻${formattedViewers}`;
      } else {
        title += ` • ${formattedViewers}`; // 시청자 수가 변동 없을 때
      }
    } else {
      title += ` • ${formattedViewers}`; // 시청자 수가 변동 없을 때
    }

    document.title = title; // 제목을 업데이트
    previousViewers = viewers; // 이전 시청자 수 업데이트
    previousTitle = originalTitle; // 현재 제목을 이전 제목으로 업데이트
  };

  const checkMediaInfo = async (mediaName, isAutoLevelEnabled) => {
    if (mediaName !== "original" || isAutoLevelEnabled) {
      // 원본 화질로 설정되지 않은 경우 or 자동 화질 선택인 경우
      const player = await waitForElementAsync("#player");
      player.className = "video mouseover ctrl_output";

      // 설정 버튼 클릭
      const settingButton = await waitForElementAsync("#player > div.player_ctrlBox > div.ctrlBox > div.right_ctrl .setting_box > button.btn_setting");
      settingButton.click();

      // 화질 변경 리스트 대기
      const settingList = await waitForElementAsync("#player > div.player_ctrlBox > div.ctrlBox > div.right_ctrl .setting_box.on .setting_list");
      const spanElement = Array.from(settingList.querySelectorAll("span")).find((el) => el.textContent.includes("화질 변경"));
      const buttonElement = spanElement.closest("button");
      buttonElement.click();

      // 두 번째 설정 대기
      const resolutionButton = await waitForElementAsync("#player > div.player_ctrlBox > div.ctrlBox > div.right_ctrl .setting_box .setting_list_subLayer ul > li:nth-child(2) > button");
      resolutionButton.click();
      resolutionButton.className = "video";
    }
  };
  const getCurrentInternalQuality = () => {
    try {
      const playerInfo = unsafeWindow.LivePlayer.getPlayerInfo();
      return playerInfo?.quality || null;
    } catch (e) {
      customLog.warn("[getCurrentInternalQuality] 오류 발생:", e);
      return null;
    }
  };
  const getIsAutoQualityMode = () => {
    try {
      const playerInfo = unsafeWindow.LivePlayer.getPlayerInfo();
      return !!playerInfo?.qualityInfo?.isAuto;
    } catch (e) {
      customLog.warn("[getIsAutoQualityMode] 오류 발생:", e);
      return false;
    }
  };
  const changeQualityLivePlayer = async (qualityName) => {
    const current = getCurrentInternalQuality();
    if (current === qualityName) {
      customLog.log(`[화질 변경 스킵] 현재(${current}) = 요청(${qualityName})`);
      return;
    }

    try {
      unsafeWindow.livePlayer.changeQuality(qualityName);
      customLog.log(`[화질 변경] → ${qualityName}`);
    } catch (e) {
      customLog.warn("[changeQualityLivePlayer] 변경 실패:", e);
    }
  };
  // [기능 수정] 화질 고정 및 1440p 차단 통합 함수
  const downgradeFrom1440p = async () => {
    try {
      const livePlayer = await waitForLivePlayer();
      const info = await livePlayer.getLiveInfo();
      // 사용 가능한 화질 목록 가져오기 (auto 제외)
      const presets = info.CHANNEL.VIEWPRESET.filter((p) => p.name !== "auto" && p.bps);

      // 설정된 목표 화질 (예: "1080", "720", "원본")
      const targetQ = GM_getValue("targetQuality", "원본");
      const isNo1440p = GM_getValue("isNo1440pEnabled", 0); // 1440p 차단 설정 확인

      let targetPreset = null;

      // 1. 사용자가 '원본'을 선택했을 때
      if (targetQ === "원본") {
        // BPS(비트레이트) 기준 내림차순 정렬 (화질 좋은 순서)
        const sorted = presets.sort((a, b) => b.bps - a.bps);
        const bestPreset = sorted[0];

        // 1440p 차단 기능이 켜져있고, 최고화질이 1440이라면?
        if (isNo1440p && bestPreset.label_resolution === "1440") {
          // 그 다음으로 좋은 화질 선택 (없으면 그대로)
          targetPreset = sorted[1] || bestPreset;
          customLog.log(`1440p 차단 설정으로 인해 ${targetPreset.label_resolution} 선택`);
        } else {
          targetPreset = bestPreset;
        }
      }
      // 2. 사용자가 특정 화질(1080, 720 등)을 선택했을 때
      else {
        targetPreset = presets.find((p) => p.label_resolution === targetQ);

        // 만약 해당 화질이 이 방송에 없다면? (예: 1080 설정했는데 720 방송일 때)
        if (!targetPreset) {
          customLog.warn(`설정한 화질(${targetQ})이 없어 최고 화질로 자동 설정합니다.`);
          targetPreset = presets.reduce((prev, curr) => (prev.bps > curr.bps ? prev : curr));
        }
      }

      // 화질 변경 실행
      if (targetPreset) {
        const targetName = qualityNameToInternalType[targetPreset.name];

        if (!targetName) {
          customLog.warn(`화질 매핑 실패: ${targetPreset.name}`);
          return;
        }

        customLog.log(`화질 변경 시도: ${targetQ} 설정 -> 적용: ${targetPreset.label_resolution} (${targetName})`);
        livePlayer.changeQuality(targetName);
      }
    } catch (e) {
      customLog.error("화질 변경 중 오류: " + e.message);
    }
  };

  const initializeQualityShortcuts = () => {
    // --- 1. 상태 관리 변수 ---
    let shortcutMap = new Map();
    let isKeyListenerAdded = false;

    // --- 2. 핵심 로직 함수 ---
    const setupQualityShortcuts = async (targetDiv) => {
      try {
        const qualityBox = targetDiv || document.querySelector(".quality_box ul");
        // 화질 목록이 없거나, 화질 목록의 li 요소가 없으면 실행 중단 (안정성 강화)
        if (!qualityBox || !qualityBox.querySelector("li")) {
          customLog.log("화질 목록을 찾을 수 없어 단축키 설정을 건너뜁니다.");
          return;
        }

        customLog.log("화질 목록 변경 감지. 단축키를 업데이트합니다.");
        const livePlayer = await waitForLivePlayer();
        const info = await livePlayer.getLiveInfo();
        const presets = info.CHANNEL.VIEWPRESET;

        if (!presets || presets.length === 0) return;

        // (이하 화질 정렬, 버튼 매핑, 단축키 설정 로직은 원본과 동일)
        presets.sort((a, b) => {
          if (a.name === "auto") return -1;
          if (b.name === "auto") return 1;
          return parseInt(b.label_resolution || 0) - parseInt(a.label_resolution || 0);
        });

        const buttonMap = new Map();
        qualityBox.querySelectorAll("li button").forEach((btn) => {
          if (btn.closest("li")?.style.display !== "none") {
            const span = btn.querySelector("span");
            if (span) {
              const currentText = span.textContent.split(" (")[0].trim();
              buttonMap.set(currentText, btn);
            }
          }
        });

        const newShortcutMap = new Map();
        const shortcutKeys = ["`", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

        presets.forEach((preset, index) => {
          if (index >= shortcutKeys.length) return;
          const button = buttonMap.get(preset.label);
          if (button) {
            const shortcutKey = shortcutKeys[index];
            const internalType = qualityNameToInternalType[preset.name];
            if (internalType) {
              newShortcutMap.set(shortcutKey, internalType);
              button.querySelector("span").textContent = `${preset.label} (${shortcutKey})`;
            }
          }
        });

        shortcutMap = newShortcutMap;
      } catch (e) {
        customLog.error("화질 단축키 설정 중 오류 발생:", e);
      }
    };

    // --- 3. 이벤트 핸들러 ---
    const handleQualityKeyDown = async (event) => {
      if (isUserTyping()) return;
      const key = event.key === "~" ? "`" : event.key;
      if (shortcutMap.has(key)) {
        event.preventDefault();
        const targetQuality = shortcutMap.get(key);
        try {
          showPlayerBar();
          const livePlayer = await waitForLivePlayer();
          livePlayer.changeQuality(targetQuality);
        } catch (e) {
          customLog.error("화질 변경에 실패했습니다.", e);
        }
      }
    };

    // --- 4. 기능 설치 로직 ---

    // 키보드 리스너는 한 번만 설치
    if (!isKeyListenerAdded) {
      document.addEventListener("keydown", handleQualityKeyDown, true);
      isKeyListenerAdded = true;
    }

    // 디바운스가 적용된 단축키 설정 함수 생성
    const debouncedSetup = debounce(setupQualityShortcuts, 1000);
    (async () => {
      const qualityBoxDiv = await waitForElementAsync(".quality_box ul");
      setupQualityShortcuts(qualityBoxDiv);
    })();
    observeUrlChanges(() => {
      setTimeout(setupQualityShortcuts, 2000);
    });
  };
  const updateBestStreamersList = () => {
    const sharedDataKey = "sharedBestStreamersData";
    const publicDataString = localStorage.getItem(sharedDataKey);

    if (!publicDataString) {
      customLog.log("[스크립트 B] 공유된 데이터가 아직 없습니다. 실행을 종료합니다.");
      return;
    }

    const myPrivateData = GM_getValue("bestStreamersList", []);
    const myPrivateDataString = JSON.stringify(myPrivateData);

    if (publicDataString !== myPrivateDataString) {
      customLog.log("[스크립트 B] 새로운 데이터를 발견했습니다! 저장소를 업데이트합니다.");

      const newPublicDataArray = JSON.parse(publicDataString);

      GM_setValue("bestStreamersList", newPublicDataArray);
      customLog.log("[스크립트 B] GM_setValue로 새 데이터를 저장했습니다:", newPublicDataArray);
    } else {
      customLog.log("[스크립트 B] 이미 최신 데이터를 가지고 있습니다. 업데이트가 불필요합니다.");
    }
  };
  /**
   * 탭 동기화 기능을 관리하는 매니저 객체를 생성하고 반환합니다.
   * @param {object} options - 설정 객체
   * @param {function(string[]): void} [options.onUpdate] - 탭 목록이 변경될 때마다 호출될 콜백 함수. URL 배열을 인자로 받습니다.
   * @param {string} [options.urlPattern] - 유저 ID와 방송 ID를 감지할 URL 패턴. 예: "/play/{userId}/{broadcastId}"
   * @param {number} [options.heartbeatIntervalMs=5000] - Heartbeat 주기 (밀리초)
   * @param {number} [options.timeoutMs=10000] - 탭 만료 시간 (밀리초)
   * @returns {{isTargetTabOpen: (function(string, string): boolean), getActiveTabs: (function(): string[]), destroy: (function(): void)}}
   */
  function createTabSyncManager(options = {}) {
    // --- 1. 설정 및 내부 상태 변수 ---
    const {
      onUpdate,
      urlPattern = "/{userId}/{broadcastId}", // 기본 URL 패턴 정의
      heartbeatIntervalMs = 5000,
      timeoutMs = 10000,
    } = options;

    const channel = new BroadcastChannel("sooplive_tab_tracker");
    const tabId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const activeTabs = {}; // 다른 탭들의 정보
    let currentUrls = []; // 자기 자신을 포함한 전체 URL 목록 (내부 상태)

    // --- 2. 내부 헬퍼 함수 ---
    const now = () => Date.now();
    const debounce = (func, delay) => {
      let timeoutId;
      return (...args) => {
        clearTimeout(timeoutId);
        setTimeout(() => func.apply(this, args), delay);
      };
    };

    const broadcast = (type) => {
      // 현재 URL을 항상 최신으로 유지
      channel.postMessage({ type, tabId, url: location.href, timestamp: now() });
    };

    const _updateListeners = () => {
      // 만료된 탭 정리
      const cutoff = now() - timeoutMs;
      for (const id in activeTabs) {
        if (activeTabs[id].lastSeen < cutoff) delete activeTabs[id];
      }

      // 최신 URL 목록 생성
      const allUrls = [location.href, ...Object.values(activeTabs).map(({ url }) => url)];
      currentUrls = [...new Set(allUrls)]; // 내부 상태 업데이트

      // 외부 콜백 호출
      if (typeof onUpdate === "function") {
        onUpdate(currentUrls);
      }
    };

    const updateListeners = debounce(_updateListeners, 100);

    // --- 3. 이벤트 핸들러 및 초기화 ---
    channel.onmessage = (e) => {
      const { type, tabId: senderId, url, timestamp } = e.data || {};
      if (!senderId || !url || senderId === tabId) return;
      if (type === "join" || type === "heartbeat") activeTabs[senderId] = { url, lastSeen: timestamp };
      else if (type === "leave") delete activeTabs[senderId];
      updateListeners();
    };

    const intervalId = setInterval(() => broadcast("heartbeat"), heartbeatIntervalMs);
    window.addEventListener("beforeunload", () => destroy());

    // 초기 진입 메시지 및 상태 업데이트
    broadcast("join");
    updateListeners();

    // --- 4. 외부로 공개될 API 메소드 ---

    /**
     * 특정 방송 탭이 열려 있는지 확인합니다.
     * @param {string} userId - 확인할 유저 아이디
     * @param {string} broadcastId - 확인할 방송 번호
     * @returns {boolean}
     */
    function isTargetTabOpen(userId, broadcastId) {
      if (!userId || !broadcastId) return false;

      // urlPattern을 기반으로 실제 찾을 경로 조각을 만듭니다.
      const targetPath = urlPattern.replace("{userId}", userId).replace("{broadcastId}", broadcastId);

      return currentUrls.some((url) => url.includes(targetPath));
    }

    /**
     * 현재 활성화된 모든 탭의 URL 목록을 반환합니다.
     * @returns {string[]}
     */
    function getActiveTabs() {
      return [...currentUrls]; // 외부에서 수정하지 못하도록 복사본 반환
    }

    /**
     * 모든 동기화 작업을 중지하고 리소스를 정리합니다.
     */
    function destroy() {
      broadcast("leave");
      clearInterval(intervalId);
      channel.close();
      // 필요하다면 onUpdate 콜백도 null 처리
      customLog.log("TabSyncManager가 종료되었습니다.");
    }

    // --- 5. API 객체 반환 ---
    return {
      isTargetTabOpen,
      getActiveTabs,
      destroy,
    };
  }

  // 3.6. 스크립트 실행 관리 함수 (Execution Management)
  const runCommonFunctions = () => {
    if (isCustomSidebarEnabled) {
      //orderSidebarSection();
      hideUsersSection();
      generateBroadcastElements(0);
      checkSidebarVisibility();
    }
    setupSettingButtonTopbar();

    if (isMonthlyRecapEnabled) observeAndAppendRecapButton();

    registerMenuBlockingWord();
    registerMenuBlockingCategory(); //[추가] 카테고리 차단 메뉴 등록 함수

    blockedUsers.forEach(function (user) {
      registerUnblockMenu(user);
    });

    blockedCategories.forEach(function (category) {
      registerCategoryUnblockMenu(category);
    });

    blockedWords.forEach(function (word) {
      registerWordUnblockMenu(word);
    });

    pinnedCategories.forEach(function (category) {
      registerCategoryUnpinMenu(category);
    });

    updateBestStreamersList();
  };
  const hideUsersSection = () => {
    const styles = [!displayMyplus && "#sidebar .myplus { display: none !important; }", !displayMyplusvod && "#sidebar .myplusvod { display: none !important; }", !displayTop && "#sidebar .top { display: none !important; }"].filter(Boolean).join(" "); // 빈 값 제거 및 합침

    if (styles) {
      GM_addStyle(styles);
    }
  };
  const removeTargetFromLinks = () => {
    try {
      const links = document.querySelectorAll("#container a[target], .side_list a[target]");
      links.forEach((link) => {
        link.removeAttribute("target");
      });
    } catch (error) {
      customLog.error("target 속성 제거 중 오류 발생:", error);
    }
  };

  class StreamerActivityScanner {
    #STREAMER_ID_LIST;
    #vodCore;
    #streamerActivityLog = [];
    #isScanCompleted = false;
    #controlButton = null;
    #abortController = null;
    #modal = null;

    constructor(vodCore, targetIds) {
      if (!vodCore) throw new Error("vodCore 객체가 필요합니다.");
      if (!targetIds) throw new Error("타겟 ID 목록이 필요합니다.");
      this.#vodCore = vodCore;
      this.#STREAMER_ID_LIST = targetIds;
      this.#modal = new DraggableResizableModal("streamer-activity-scanner", "채팅 로그");
      this.#setupControlButton();
    }

    static #secondsToHMS(seconds) {
      seconds = Math.floor(seconds);
      const h = String(Math.floor(seconds / 3600)).padStart(2, "0"),
        m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0"),
        s = String(seconds % 60).padStart(2, "0");
      return `[${h}:${m}:${s}]`;
    }
    static #xmlToJson(xml) {
      var obj = {};
      if (xml.nodeType === 1) {
        if (xml.attributes.length > 0) {
          obj["@attributes"] = {};
          for (var j = 0; j < xml.attributes.length; j++) {
            var attribute = xml.attributes.item(j);
            obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
          }
        }
      } else if (xml.nodeType === 3 || xml.nodeType === 4) {
        obj = xml.nodeValue;
      }
      if (xml.hasChildNodes()) {
        for (var i = 0; i < xml.childNodes.length; i++) {
          var item = xml.childNodes.item(i);
          var nodeName = item.nodeName;
          if (typeof obj[nodeName] === "undefined") {
            obj[nodeName] = StreamerActivityScanner.#xmlToJson(item);
          } else {
            if (typeof obj[nodeName].push === "undefined") {
              var old = obj[nodeName];
              obj[nodeName] = [];
              obj[nodeName].push(old);
            }
            obj[nodeName].push(StreamerActivityScanner.#xmlToJson(item));
          }
        }
      }
      return obj;
    }
    static #getColorFromUserId(userId) {
      let hash = 0;
      for (let i = 0; i < userId.length; i++) {
        hash = userId.charCodeAt(i) + ((hash << 5) - hash);
      }
      const hue = hash % 360;
      return `hsl(${hue}, 75%, 75%)`;
    }
    static async #fetchAndParseChatData(url, signal) {
      const response = await fetch(url, { cache: "force-cache", signal });
      const data = await response.text();
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(data, "text/xml");
      const jsonData = StreamerActivityScanner.#xmlToJson(xmlDoc);
      if (jsonData.root && Array.isArray(jsonData.root["#text"])) {
        delete jsonData.root["#text"];
      }
      return jsonData;
    }

    // [수정] 버튼 클릭 시 토글 동작을 하도록 onclick 핸들러 변경
    #setupControlButton() {
      const chatWrap = document.querySelector(".chatting-item-wrap");
      if (chatWrap) {
        this.#controlButton = document.createElement("button");
        this.#controlButton.id = "sa-control-btn";
        this.#controlButton.className = "chat-icon highlight-icon";
        this.#controlButton.onclick = () => {
          if (this.#isScanCompleted) {
            // 스캔 완료 후: 모달이 보이면 숨기고, 아니면 보여줌
            this.#modal.isVisible() ? this.hidePanel() : this.showPanel();
          } else {
            // 스캔 전: 스캔 시작
            this.startScan();
          }
        };
        chatWrap.appendChild(this.#controlButton);
        this.#updateButton("", false);
      }
    }

    #storeStreamerActivity(jsonData, accumulatedTime) {
      const processItems = (items, type) => {
        if (!items) return;
        if (!Array.isArray(items)) items = [items];
        for (const item of items) {
          const userId = item.u ? item.u["#text"].split("(")[0] : "";
          if (this.#STREAMER_ID_LIST.has(userId)) {
            const seconds = parseFloat(item.t["#text"]) + accumulatedTime;
            const activity = { type, seconds: Math.floor(seconds), userId, userName: item.n ? item.n["#cdata-section"] : "알 수 없음", message: "" };
            switch (type) {
              case "chat":
                activity.message = item.m ? item.m["#cdata-section"] : "";
                break;
              case "balloon":
                activity.message = `별풍선 ${item.c ? item.c["#text"] : "0"}개`;
                break;
              case "challenge_mission":
              case "battle_mission":
                activity.message = `${type === "challenge_mission" ? "도전" : "대결"} 미션 후원 ${item.c ? item.c["#text"] : "0"}개 (${item.title ? item.title["#cdata-section"] : "제목 없음"})`;
                break;
            }
            this.#streamerActivityLog.push(activity);
          }
        }
      };
      if (jsonData && jsonData.root) {
        processItems(jsonData.root.chat, "chat");
        processItems(jsonData.root.balloon, "balloon");
        processItems(jsonData.root.challenge_mission, "challenge_mission");
        processItems(jsonData.root.battle_mission, "battle_mission");
      }
    }

    #updateButton(text, disabled) {
      if (!this.#controlButton) return;
      this.#controlButton.textContent = text;
      this.#controlButton.disabled = disabled;
      this.#controlButton.style.cursor = disabled ? "not-allowed" : "pointer";
      this.#controlButton.style.opacity = disabled ? "0.7" : "1";
      this.#controlButton.style.fontSize = "8px";
    }

    #showNotification(message, isError = false) {
      this.#modal?.showNotification(message, isError);
    }

    async startScan() {
      this.#abortController?.abort();
      this.#abortController = new AbortController();
      const signal = this.#abortController.signal;

      try {
        const streamerCount = this.#STREAMER_ID_LIST.size;
        this.#updateButton(`0`, true);
        this.#streamerActivityLog = [];
        let accumulatedTime = 0;

        for (const item of this.#vodCore.fileItems) {
          const progress = Math.round((accumulatedTime / this.#vodCore.config.totalFileDuration) * 100);
          this.#updateButton(`${progress}`, true);
          const url = item.fileInfoKey.includes("clip_") ? `https://vod-normal-kr-cdn-z01.sooplive.co.kr/${item.fileInfoKey.split("_").join("/")}_c.xml?type=clip&rowKey=${item.fileInfoKey}_c` : `https://videoimg.sooplive.co.kr/php/ChatLoadSplit.php?rowKey=${item.fileInfoKey}_c`;

          for (let cs = 0; cs <= item.duration; cs += 300) {
            const chatData = await StreamerActivityScanner.#fetchAndParseChatData(`${url}&startTime=${cs}`, signal);
            this.#storeStreamerActivity(chatData, accumulatedTime);
            await new Promise((r) => setTimeout(r, 50));
          }
          accumulatedTime += parseInt(item.duration);
        }

        this.#streamerActivityLog.sort((a, b) => {
          const timeDiff = a.seconds - b.seconds;
          return timeDiff !== 0 ? timeDiff : (a.type !== "chat" ? 0 : 1) - (b.type !== "chat" ? 0 : 1);
        });

        this.#isScanCompleted = true;
        this.#updateButton("", false);
        this.#showNotification(`스캔 완료! (${this.#streamerActivityLog.length}개)`);
        this.showPanel();
      } catch (error) {
        if (error.name === "AbortError") {
          return;
        }
        this.#updateButton("", false);
        this.#showNotification("오류가 발생했습니다.", true);
      }
    }

    populatePanel() {
      const contentElement = this.#modal.getContentElement();
      if (!contentElement) return;

      this.#modal.setTitle(`채팅 모아보기 (즐찾 ${allFollowUserIds.length}명, 수동 ${selectedUsersArray.length}명${isCheckBestStreamersListEnabled ? `, 베스 ${bestStreamersList.length}명` : ""}) (${this.#streamerActivityLog.length}개)`);
      if (this.#streamerActivityLog.length === 0) {
        contentElement.innerHTML = `<div style="padding:10px; color: #aaa;">검색된 스트리머 활동이 없습니다.</div>`;
        return;
      }

      const list = document.createElement("ul");
      list.style.cssText = "list-style:none; padding:5px; margin:0;";

      this.#streamerActivityLog.forEach((activity) => {
        const item = document.createElement("li");
        const { userId, userName, message, type, seconds } = activity;
        const userColor = StreamerActivityScanner.#getColorFromUserId(userId);
        const profileImgUrl = `https://profile.img.sooplive.co.kr/LOGO/${userId.substring(0, 2)}/${userId}/${userId}.jpg`;
        const messageContent = type !== "chat" ? "🎈 " + message : message;

        item.style.cssText = "display:grid; grid-template-columns:65px 24px 1fr; gap:0 8px; align-items:flex-start; padding:6px 10px; border-radius:4px; line-height:1.5; font-size:14px;";
        if (type !== "chat") item.style.fontStyle = "italic";

        item.innerHTML = `
                <span class="timestamp" data-seconds="${seconds}" style="color:#a9a9b3; cursor:pointer; white-space:nowrap; font-size:15px; margin-top:2px;">${StreamerActivityScanner.#secondsToHMS(seconds).replace(/[\[\]]/g, "")}</span>
                <img class="profile-pic" src="${profileImgUrl}" alt="profile" title="${userId}" onerror="this.style.visibility='hidden'" style="object-fit: cover; width:24px; height:24px; border-radius:50%;">
                <div class="content-wrap" style="word-break:break-all; color:#dcdcdc;">
                    <a class="username-link" href="https://ch.sooplive.co.kr/${userId}" target="_blank" title="채널 방문: ${userId}" style="text-decoration:none; color:inherit; font-weight:bold; margin-right:6px; font-size:16px;">
                        <span class="username" style="color: ${userColor};">${userName}</span>
                    </a>
                    <span class="message" style="font-size:16px;">${messageContent}</span>
                </div>`;
        item.querySelector(".timestamp").onclick = () => {
          unsafeWindow.vodCore.seek(Math.max(0, seconds - 2));
        };
        list.appendChild(item);
      });

      contentElement.innerHTML = "";
      contentElement.appendChild(list);
      contentElement.scrollTop = contentElement.scrollHeight;
    }

    showPanel() {
      if (!this.#isScanCompleted) return;
      this.populatePanel();
      this.#modal.show();
    }

    hidePanel() {
      this.#modal.hide();
    }

    destroy() {
      this.#abortController?.abort("인스턴스 파괴");
      this.#modal?.destroy();
      this.#controlButton?.remove();
    }
  }

  class VODHighlightScanner {
    #API_URL = "https://apisabana.sooplive.co.kr/service/vod_star2_stats.php";
    #CHAPTER_API_URL = "https://stbbs.sooplive.co.kr/api/chapter/Controllers/ChapterListController.php";
    #vodCore;
    #videoInfo = {};
    #highlights = [];
    #isScanCompleted = false;
    #modal = null;
    #controlButton = null;

    constructor(vodCore, bbsNo) {
      if (!vodCore || !bbsNo) throw new Error("vodCore 또는 bbsNo 객체가 누락되었습니다.");

      this.#vodCore = vodCore;
      this.#videoInfo = {
        nTitleNo: vodCore.config.titleNo || vodCore.config.title_no,
        nStationNo: vodCore.config.stationNo || vodCore.config.station_no,
        nBbsNo: bbsNo,
        szLoginId: vodCore.config.loginId || "",
      };

      if (!this.#videoInfo.nTitleNo || !this.#videoInfo.nStationNo || !this.#videoInfo.nBbsNo) {
        throw new Error(`필수 파라미터가 누락되었습니다: ${JSON.stringify(this.#videoInfo)}`);
      }
      this.#modal = new DraggableResizableModal("vod-highlight-scanner", "VOD 하이라이트");
      this.#setupControlButton();
    }

    static #secondsToHMS(seconds) {
      seconds = Math.floor(seconds);
      const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
      const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
      const s = String(seconds % 60).padStart(2, "0");
      return `[${h}:${m}:${s}]`;
    }

    // [수정] 버튼 클릭 시 토글 동작을 하도록 onclick 핸들러 변경
    #setupControlButton() {
      const chatWrap = document.querySelector(".chatting-item-wrap");
      if (chatWrap) {
        this.#controlButton = document.createElement("button");
        this.#controlButton.id = "hl-control-btn";
        this.#controlButton.className = "chat-icon statistics-icon_54334 statistics";
        this.#controlButton.onclick = () => {
          if (this.#isScanCompleted) {
            this.#modal.isVisible() ? this.hidePanel() : this.showPanel();
          } else {
            this.startScan();
          }
        };
        chatWrap.appendChild(this.#controlButton);
        this.#updateButton("", false);
      }
    }

    #updateButton(text, disabled) {
      if (this.#controlButton) {
        this.#controlButton.textContent = text;
        this.#controlButton.disabled = disabled;
      }
    }
    #showNotification(message, isError = false) {
      this.#modal?.showNotification(message, isError);
    }

    async startScan() {
      if (!this.#videoInfo.szLoginId) {
        this.showPanel();
        this.#showNotification("비로그인 (일부 기능 제한)", false, 5000);
      }
      this.#updateButton("", true);
      this.#highlights = [];

      try {
        const chapterApiUrl = `${this.#CHAPTER_API_URL}?nTitleNo=${this.#videoInfo.nTitleNo}&szFileType=REVIEW`;
        const chapterPromise = fetch(chapterApiUrl, { credentials: "include" }).then((res) => res.json());

        const menuParams = new URLSearchParams({ szAction: "list", nDeviceType: "1", szSysType: "html5", nTitleNo: this.#videoInfo.nTitleNo, szLang: "ko_KR", szLoginId: this.#videoInfo.szLoginId });
        const menuPromise = fetch(this.#API_URL, { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: menuParams.toString(), credentials: "include" }).then((res) => res.json());

        const [chapterResult, menuData] = await Promise.all([chapterPromise, menuPromise]);

        if (chapterResult?.result === 1 && chapterResult.data) {
          chapterResult.data.forEach((chapter) => {
            this.#highlights.push({ seconds: chapter.time_sec, description: `[🚩챕터] ${chapter.title}` });
          });
        }

        if (menuData?.result === 1 && menuData.data) {
          const excludedModules = new Set(["BjFavView", "BjHappy", "BjUpCnt"]);
          const dataPromises = menuData.data
            .filter((module) => !excludedModules.has(module.module_name))
            .map((module) => {
              const viewParams = new URLSearchParams({ szAction: "view", nDeviceType: "1", nTitleNo: this.#videoInfo.nTitleNo, szLang: "ko_KR", nStationNo: this.#videoInfo.nStationNo, nBbsNo: this.#videoInfo.nBbsNo, szType: module.data_type === "1" ? "user" : "bj", szModule: module.module_name, nIdx: module.idx, szSysType: "html5", szLoginId: this.#videoInfo.szLoginId });
              return fetch(this.#API_URL, { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: viewParams.toString(), credentials: "include" })
                .then((res) => res.json())
                .then((data) => ({ module, data }));
            });

          const allData = await Promise.all(dataPromises);
          for (const { module, data } of allData) {
            if (data.result !== 1 || !data.data) continue;
            const { title } = module;

            if (data.data.cnt && Array.isArray(data.data.cnt) && data.data.cnt.length > 0) {
              let overallPeak = { minute: -1, value: -1 };
              for (const [minute, value] of data.data.cnt) {
                if (value > overallPeak.value) {
                  overallPeak = { minute, value };
                }
              }
              if (overallPeak.minute !== -1) {
                const unit = title.includes("채팅") ? "개" : "명";
                const description = `🚀 최고 ${title.replace(" 그래프", "")}: ${overallPeak.value.toLocaleString()}${unit}`;
                this.#highlights.push({ seconds: overallPeak.minute * 60, description });
              }
            } else if (Array.isArray(data.data) && data.data.length > 0 && data.data[0]?.hasOwnProperty("duration")) {
              data.data.forEach((item) => {
                this.#highlights.push({ seconds: item.duration, description: title });
              });
            }
          }
        }

        this.#highlights.sort((a, b) => a.seconds - b.seconds);
        this.#isScanCompleted = true;
        this.#updateButton("", false);
        this.#showNotification(`분석 완료! (${this.#highlights.length}개)`);
        this.showPanel();
      } catch (error) {
        this.#updateButton("", false);
        this.#showNotification(error.message, true);
      }
    }

    populatePanel() {
      const contentElement = this.#modal.getContentElement();
      if (!contentElement) return;

      this.#modal.setTitle(`VOD 하이라이트 (${this.#highlights.length}개)`);

      if (this.#highlights.length === 0) {
        contentElement.innerHTML = `<div style="padding:10px; color: #aaa;">분석된 하이라이트가 없습니다.</div>`;
        return;
      }

      const list = document.createElement("ul");
      list.style.cssText = "list-style:none; padding:5px; margin:0;";

      this.#highlights.forEach((activity) => {
        const item = document.createElement("li");
        item.style.cssText = "display:flex; gap:12px; align-items:flex-start; padding:8px 10px; border-radius:4px; font-size:15px;";

        item.innerHTML = `
                <span class="timestamp" data-seconds="${activity.seconds}" style="font-size: 16px; color:#a9a9b3; cursor:pointer; white-space:nowrap; font-weight:bold; flex-shrink: 0; line-height: 1.5;">
                    ${VODHighlightScanner.#secondsToHMS(activity.seconds)}
                </span>
                <div class="description" style="font-size: 16px; color:#dcdcdc; line-height: 1.5;">
                    ${activity.description}
                </div>`;
        item.querySelector(".timestamp").onclick = () => {
          this.#vodCore.seek(activity.seconds);
        };
        list.appendChild(item);
      });

      contentElement.innerHTML = "";
      contentElement.appendChild(list);
    }

    showPanel() {
      this.populatePanel();
      this.#modal.show();
    }

    hidePanel() {
      this.#modal.hide();
    }

    destroy() {
      this.#modal?.destroy();
      this.#controlButton?.remove();
    }
  }
  // 다른 스크립트와의 CSS 클래스 이름 충돌을 방지하기 위해 페이지 로드 시 한 번만 고유한 접미사를 생성합니다.
  const uniqueStyleSuffix = Math.random().toString(36).substring(2, 8);

  /**
   * 기본 클래스 이름에 고유한 접미사를 추가하여 스코프가 지정된 CSS 클래스 이름을 반환합니다.
   * @param {string} baseName 기본 클래스 이름
   * @returns {string} 고유한 접미사가 추가된 클래스 이름 (예: 'modal-header-a1b2c3')
   */
  const scopedClass = (baseName) => `${baseName}-${uniqueStyleSuffix}`;

  /**
   * 드래그 및 크기 조절이 가능한 재사용 가능한 모달 클래스입니다.
   * 위치, 크기, 표시 상태를 관리하고 localStorage에 상태를 저장합니다.
   * CSS 클래스 이름에 고유한 접미사를 사용하여 스타일 충돌을 방지합니다.
   */
  class DraggableResizableModal {
    #options;
    #modalElement = null;
    #headerElement = null;
    #contentElement = null;
    #resizeHandleElement = null;
    #closeButton = null;
    #titleElement = null;
    #id = "";
    #localStorageKey = "";
    #initialState = {};
    #notificationElement = null;
    #notificationTimeout = null;

    constructor(id, title, initialState = {}, options = {}) {
      this.#id = id;
      this.#localStorageKey = `MODAL_STATE_${this.#id}`;
      this.#initialState = { width: "400px", height: "400px", top: "150px", right: "150px", left: "auto", ...initialState };
      this.#options = { ignoreSavedState: false, ...options }; // 옵션 저장
      this.#init(title);
    }

    #init(title) {
      this.#addStyles();
      this.#modalElement = document.createElement("div");
      this.#modalElement.id = this.#id;
      this.#modalElement.className = scopedClass("draggable-modal");
      this.#modalElement.style.display = "none";

      this.#modalElement.innerHTML = `
            <div class="${scopedClass("modal-header")}">
                <span class="${scopedClass("modal-header-title")}">${title}</span>
                <span class="${scopedClass("modal-notification")}"></span>
                <button class="${scopedClass("modal-close-btn")}">&times;</button>
            </div>
            <div class="${scopedClass("modal-content")}"></div>
            <div class="${scopedClass("modal-resize-handle")}"></div>
        `;

      document.body.appendChild(this.#modalElement);

      this.#headerElement = this.#modalElement.querySelector(`.${scopedClass("modal-header")}`);
      this.#contentElement = this.#modalElement.querySelector(`.${scopedClass("modal-content")}`);
      this.#resizeHandleElement = this.#modalElement.querySelector(`.${scopedClass("modal-resize-handle")}`);
      this.#closeButton = this.#modalElement.querySelector(`.${scopedClass("modal-close-btn")}`);
      this.#titleElement = this.#modalElement.querySelector(`.${scopedClass("modal-header-title")}`);
      this.#notificationElement = this.#modalElement.querySelector(`.${scopedClass("modal-notification")}`);

      this.#closeButton.onclick = () => this.hide();
      this.#initDraggableAndResizable();
      this.#loadState();
      this.#handleScrollLock(); // 스크롤 잠금 핸들러 활성화
    }

    #addStyles() {
      const styleId = `draggable-modal-styles-${uniqueStyleSuffix}`;
      if (document.getElementById(styleId)) return;

      GM_addStyle(`
            .${scopedClass("draggable-modal")} { display: none; flex-direction: column; background-color: #202024; border: 1px solid #444; border-radius: 8px; box-shadow: 0 5px 20px rgba(0,0,0,0.4); z-index: 9999; color: #efeff1; min-width: 300px; min-height: 200px; position: fixed; overflow: hidden; }
            .${scopedClass("modal-header")} { padding: 10px 15px; background-color: #2a2a2e; cursor: move; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #444; color: #fff; }
            .${scopedClass("modal-header-title")} { font-weight: bold; pointer-events: none; flex-grow: 1; }
            .${scopedClass("modal-close-btn")} { background: none; border: none; color: #aaa; font-size: 20px; cursor: pointer; line-height: 1; margin-left: 10px; }
            .${scopedClass("modal-close-btn")}:hover { color: #fff; }
            .${scopedClass("modal-content")} { flex-grow: 1; overflow-y: auto; padding: 10px; background-color: #18181b; }
            .${scopedClass("modal-resize-handle")} { position: absolute; right: 0; bottom: 0; width: 15px; height: 15px; cursor: se-resize; z-index: 10000; }
            .${scopedClass("modal-resize-handle")}::after { content: ''; position: absolute; right: 2px; bottom: 2px; width: 8px; height: 8px; background: linear-gradient(135deg, transparent 40%, #888 40%, #888 60%, transparent 60%); pointer-events: none; }
            .${scopedClass("modal-notification")} { color: #6bff96; font-size: 13px; font-weight: bold; opacity: 0; transition: opacity 0.5s; pointer-events: none; text-align: right; margin: 0 10px; }

            /* ✨ [수정됨] 스크롤 잠금을 위한 CSS 클래스 */
            .modal-scroll-lock {
                overflow: hidden !important;
            }
        `).id = styleId;
    }

    /**
     * 모달 위에 마우스가 있을 때 body 스크롤을 막는 메서드 (클래스 기반)
     */
    #handleScrollLock() {
      const scrollLockClass = "modal-scroll-lock";
      const htmlEl = document.documentElement;
      const bodyEl = document.body;

      this.#modalElement.addEventListener("mouseenter", () => {
        if (!this.isVisible()) return;
        htmlEl.classList.add(scrollLockClass);
        bodyEl.classList.add(scrollLockClass);
      });

      this.#modalElement.addEventListener("mouseleave", () => {
        htmlEl.classList.remove(scrollLockClass);
        bodyEl.classList.remove(scrollLockClass);
      });
    }

    #initDraggableAndResizable() {
      const panel = this.#modalElement;
      const header = this.#headerElement;
      const resizeHandle = this.#resizeHandleElement;
      let isDragging = false,
        isResizing = false,
        initial = {};

      const onDrag = (e) => {
        e.preventDefault();
        if (isDragging) {
          let newLeft = e.clientX - initial.x;
          let newTop = e.clientY - initial.y;
          const maxLeft = window.innerWidth - panel.offsetWidth;
          const maxTop = window.innerHeight - panel.offsetHeight;
          newLeft = Math.max(0, Math.min(newLeft, maxLeft));
          newTop = Math.max(0, Math.min(newTop, maxTop));
          panel.style.top = `${newTop}px`;
          panel.style.left = `${newLeft}px`;
          panel.style.right = "auto";
        }
        if (isResizing) {
          const maxWidth = window.innerWidth - panel.offsetLeft;
          const maxHeight = window.innerHeight - panel.offsetTop;
          let newWidth = initial.w + (e.clientX - initial.x);
          let newHeight = initial.h + (e.clientY - initial.y);
          newWidth = Math.max(300, Math.min(newWidth, maxWidth));
          newHeight = Math.max(200, Math.min(newHeight, maxHeight));
          panel.style.width = `${newWidth}px`;
          panel.style.height = `${newHeight}px`;
        }
      };

      const stopActions = () => {
        if (isDragging || isResizing) this.#saveState();
        isDragging = isResizing = false;
        document.documentElement.style.userSelect = "";
        window.removeEventListener("mousemove", onDrag);
        window.removeEventListener("mouseup", stopActions);
      };

      header.addEventListener("mousedown", (e) => {
        if (e.target.closest(`.${scopedClass("modal-close-btn")}`)) return;
        isDragging = true;
        initial = { x: e.clientX - panel.offsetLeft, y: e.clientY - panel.offsetTop };
        document.documentElement.style.userSelect = "none";
        window.addEventListener("mousemove", onDrag);
        window.addEventListener("mouseup", stopActions);
      });

      resizeHandle.addEventListener("mousedown", (e) => {
        isResizing = true;
        initial = { x: e.clientX, y: e.clientY, w: panel.offsetWidth, h: panel.offsetHeight };
        document.documentElement.style.userSelect = "none";
        e.preventDefault();
        e.stopPropagation();
        window.addEventListener("mousemove", onDrag);
        window.addEventListener("mouseup", stopActions);
      });
    }

    #saveState() {
      const state = {
        width: this.#modalElement.style.width,
        height: this.#modalElement.style.height,
        top: this.#modalElement.style.top,
        left: this.#modalElement.style.left,
        right: this.#modalElement.style.right,
      };
      localStorage.setItem(this.#localStorageKey, JSON.stringify(state));
    }

    #loadState() {
      if (this.#options.ignoreSavedState) {
        Object.assign(this.#modalElement.style, this.#initialState);
        return;
      }

      let savedState;
      try {
        savedState = JSON.parse(localStorage.getItem(this.#localStorageKey));
      } catch (e) {
        /* 무시 */
      }

      if (savedState) {
        Object.assign(this.#modalElement.style, savedState);
      } else {
        Object.assign(this.#modalElement.style, this.#initialState);
      }
    }

    #resetPositionIfOffscreen() {
      this.#modalElement.style.visibility = "hidden";
      this.#modalElement.style.display = "flex";
      const rect = this.#modalElement.getBoundingClientRect();
      this.#modalElement.style.display = "none";
      this.#modalElement.style.visibility = "visible";
      const isOffscreen = rect.bottom < 50 || rect.right < 50 || rect.top > window.innerHeight - 50 || rect.left > window.innerWidth - 50;
      if (isOffscreen) {
        Object.assign(this.#modalElement.style, this.#initialState);
        this.#saveState();
      }
    }

    show() {
      this.#resetPositionIfOffscreen();
      this.#modalElement.style.display = "flex";
      const modals = document.querySelectorAll(`.${scopedClass("draggable-modal")}`);
      const maxZ = Math.max(9999, ...Array.from(modals).map((el) => parseFloat(window.getComputedStyle(el).zIndex) || 0));
      this.#modalElement.style.zIndex = maxZ + 1;
    }

    hide() {
      this.#modalElement.style.display = "none";
      // ✨ [수정됨] 모달이 숨겨질 때 스크롤 잠금 클래스를 확실하게 제거
      const scrollLockClass = "modal-scroll-lock";
      document.documentElement.classList.remove(scrollLockClass);
      document.body.classList.remove(scrollLockClass);
    }

    isVisible() {
      return this.#modalElement.style.display !== "none";
    }
    getContentElement() {
      return this.#contentElement;
    }
    setTitle(newTitle) {
      if (this.#titleElement) this.#titleElement.textContent = newTitle;
    }

    showNotification(message, isError = false, duration = 3000) {
      if (!this.#notificationElement) return;
      clearTimeout(this.#notificationTimeout);
      this.#notificationElement.textContent = message;
      this.#notificationElement.style.color = isError ? "#ff6b6b" : "#6bff96";
      this.#notificationElement.style.opacity = "1";
      this.#notificationTimeout = setTimeout(() => {
        this.#notificationElement.style.opacity = "0";
      }, duration);
    }

    destroy() {
      clearTimeout(this.#notificationTimeout);
      // ✨ [수정됨] 모달이 제거되기 전에 스크롤 잠금 클래스를 확실하게 제거
      const scrollLockClass = "modal-scroll-lock";
      document.documentElement.classList.remove(scrollLockClass);
      document.body.classList.remove(scrollLockClass);
      this.#modalElement?.remove();
    }

    // [추가] 외부에서 모달 요소에 접근하기 위한 public 메서드
    getModalElement() {
      return this.#modalElement;
    }
  }

  /**
   * =================================================================
   * [최종] 영상 필터 전용 클래스 (PlayerAdvancedControls)
   * =================================================================
   */
  class PlayerAdvancedControls {
    #videoElement;
    #panelElement;
    #controlButton;
    #isPanelVisible = false;

    #filterSettings = { brightness: 100, contrast: 100, saturate: 100 };

    // body 클릭 이벤트를 관리하기 위한 속성
    #boundBodyClickListener = this.#handleBodyClick.bind(this);

    constructor(videoElement) {
      if (!videoElement) {
        customLog.error("[AdvControls] 비디오 요소를 찾을 수 없습니다.");
        return;
      }
      this.#videoElement = videoElement;
      this.#filterSettings = GM_getValue("filterSettings", this.#filterSettings);
      this.#createUI();
      this.#addEventListeners();
      this.#applyVideoFilters();
    }

    #createUI() {
      const rightCtrl = document.querySelector("#player .player_ctrlBox .ctrlBox .right_ctrl");
      if (rightCtrl) {
        this.#controlButton = document.createElement("button");
        this.#controlButton.type = "button";
        this.#controlButton.className = "btn_advanced_controls";
        this.#controlButton.title = "영상 효과";
        const captureButton = rightCtrl.querySelector(".imageCapture");
        if (captureButton) {
          rightCtrl.insertBefore(this.#controlButton, captureButton);
        } else {
          rightCtrl.insertBefore(this.#controlButton, rightCtrl.firstChild);
        }
      }

      this.#panelElement = document.createElement("div");
      this.#panelElement.className = "advanced-controls-panel";

      this.#panelElement.innerHTML = `
            <div class="ac-header">
                <span>영상 필터</span>
            </div>
            <div class="ac-content">
                ${this.#createSliderGroup("brightness", "밝기", 50, 150, this.#filterSettings.brightness)}
                ${this.#createSliderGroup("contrast", "대비", 50, 150, this.#filterSettings.contrast)}
                ${this.#createSliderGroup("saturate", "채도", 50, 150, this.#filterSettings.saturate)}
            </div>
            <div class="ac-footer">
                <button class="ac-reset-btn">초기화</button>
            </div>
        `;

      const playerDiv = document.getElementById("player");
      if (playerDiv) playerDiv.appendChild(this.#panelElement);
    }

    #createSliderGroup(id, label, min, max, value) {
      return `<div class="ac-control-group"><label for="ac-slider-${id}">${label}</label><div class="slider-container"><input type="range" id="ac-slider-${id}" data-filter="${id}" min="${min}" max="${max}" value="${value}"><span class="slider-value" id="ac-value-${id}">${value}%</span></div></div>`;
    }

    #handleBodyClick(e) {
      if (this.#isPanelVisible && !this.#panelElement.contains(e.target)) {
        this.togglePanel();
      }
    }

    #addEventListeners() {
      this.#controlButton?.addEventListener("click", (e) => {
        e.stopPropagation();
        this.togglePanel();
      });

      this.#panelElement.addEventListener("click", (e) => e.stopPropagation());

      this.#panelElement.querySelectorAll('input[type="range"]').forEach((slider) => {
        slider.addEventListener("input", (e) => {
          const { filter } = e.target.dataset;
          const value = e.target.value;
          this.#filterSettings[filter] = Number(value);
          document.getElementById(`ac-value-${filter}`).textContent = `${value}%`;
          this.#applyVideoFilters();
        });
        slider.addEventListener("change", () => this.#saveSettings());
        slider.addEventListener("dblclick", (e) => {
          e.target.value = 100;
          e.target.dispatchEvent(new Event("input"));
          e.target.dispatchEvent(new Event("change"));
        });
      });

      this.#panelElement.querySelector(".ac-reset-btn").addEventListener("click", () => {
        this.#filterSettings = { brightness: 100, contrast: 100, saturate: 100 };
        this.#saveSettings();
        this.#applyVideoFilters();
        // UI도 리셋
        for (const [key, value] of Object.entries(this.#filterSettings)) {
          const slider = this.#panelElement.querySelector(`#ac-slider-${key}`);
          const valueLabel = this.#panelElement.querySelector(`#ac-value-${key}`);
          if (slider) slider.value = value;
          if (valueLabel) valueLabel.textContent = `${value}%`;
        }
      });
    }

    #applyVideoFilters() {
      const { brightness, contrast, saturate } = this.#filterSettings;
      this.#videoElement.style.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturate}%)`;
    }

    #saveSettings() {
      GM_setValue("filterSettings", this.#filterSettings);
    }

    togglePanel() {
      this.#isPanelVisible = !this.#isPanelVisible;
      this.#panelElement.style.display = this.#isPanelVisible ? "flex" : "none";

      if (this.#isPanelVisible) {
        document.body.addEventListener("click", this.#boundBodyClickListener);
      } else {
        document.body.removeEventListener("click", this.#boundBodyClickListener);
      }
    }

    destroy() {
      document.body.removeEventListener("click", this.#boundBodyClickListener);
      this.#controlButton?.remove();
      this.#panelElement?.remove();
    }
  }

  class PlayerPanzoom {
    #videoElement;
    #videoContainer;
    #playerElement;
    #panzoomInstance = null;
    #controlsElement = null;
    #boundOnWheel;
    #roiElement = null;
    #isRoiActive = false;
    #videoOverlay;
    #roiModal = null;
    #drawLoopAnimationId = null;
    #resizeObserver = null;
    #roiSourceRect = { sx: 0, sy: 0, sWidth: 0, sHeight: 0 };
    #lastUpdateTime = 0;
    #updateTimeout = null;

    isActive = false;

    constructor(videoElement, videoContainer, playerElement) {
      this.#videoElement = videoElement;
      this.#videoContainer = videoContainer;
      this.#playerElement = playerElement;
      this.#boundOnWheel = this.#onWheel.bind(this);
      this.#videoOverlay = document.getElementById("videoLayerCover");
    }

    init() {
      if (this.isActive) return;
      customLog.log("Panzoom 및 ROI 기능을 초기화합니다.");
      if (this.#videoOverlay) this.#videoOverlay.style.display = "none";

      // [수정] classList 대신 dataset 사용
      this.#playerElement.dataset.panzoomEnabled = "true";

      this.#videoContainer.style.overflow = "hidden";
      this.#panzoomInstance = Panzoom(this.#videoElement, {
        maxScale: 5,
        minScale: 1,
        contain: "outside",
      });
      this.#videoContainer.addEventListener("wheel", this.#boundOnWheel, { passive: false });
      this.#addControls();
      this.#createRoiElement();
      this.isActive = true;
    }

    destroy() {
      if (!this.isActive) return;
      customLog.log("Disabling Panzoom and ROI functionality.");
      if (this.#videoOverlay) this.#videoOverlay.style.display = "";
      delete this.#playerElement.dataset.panzoomEnabled;
      delete this.#playerElement.dataset.roiActive;
      this.#videoContainer.removeEventListener("wheel", this.#boundOnWheel);
      this.#panzoomInstance?.destroy();
      this.#panzoomInstance = null;
      this.#controlsElement?.remove();
      this.#controlsElement = null;
      this.#roiElement?.remove();
      this.#roiElement = null;
      this.#roiModal?.destroy();
      this.#roiModal = null;
      if (this.#drawLoopAnimationId) cancelAnimationFrame(this.#drawLoopAnimationId);
      this.#drawLoopAnimationId = null;
      this.#resizeObserver?.disconnect();
      this.#resizeObserver = null;
      if (this.#updateTimeout) clearTimeout(this.#updateTimeout);
      this.#updateTimeout = null;
      this.#videoContainer.style.overflow = "";
      this.#videoElement.style.transform = "";
      this.isActive = false;
      this.#isRoiActive = false;
    }

    #onWheel(event) {
      if (!this.isActive || !this.#panzoomInstance) return;
      event.preventDefault();
      this.#panzoomInstance.zoomWithWheel(event);
    }

    #addControls() {
      this.#controlsElement = document.createElement("div");
      this.#controlsElement.id = "zoom-controls-container";
      this.#controlsElement.style.cssText = `
            position: absolute; z-index: 1000; bottom: 80px; left: 20px;
            background: rgba(0,0,0,0.5); padding: 5px; border-radius: 5px; color: white;
        `;

      const buttons = [
        { id: "zoom-in-btn", title: "Zoom In", text: "+", action: () => this.#panzoomInstance?.zoomIn() },
        { id: "zoom-out-btn", title: "Zoom Out", text: "-", action: () => this.#panzoomInstance?.zoomOut() },
        { id: "zoom-reset-btn", title: "Reset", text: "Reset", action: () => this.#panzoomInstance?.reset() },
        { id: "toggle-roi-btn", title: "Toggle Popup", text: "Popup", action: () => this.#toggleRoiVisibility() },
      ];

      buttons.forEach(({ id, title, text, action }) => {
        const button = document.createElement("button");
        button.id = id;
        button.title = title;
        button.textContent = text;
        button.style.cssText = `
                padding: 5px 10px; margin: 2px; color: white;
                background-color: #333; border: 1px solid #555; cursor: pointer;
            `;
        this.#controlsElement.appendChild(button);
      });

      this.#controlsElement.addEventListener("click", (e) => {
        e.stopPropagation();
        const button = buttons.find((b) => b.id === e.target.id);
        if (button) button.action();
      });

      this.#playerElement.appendChild(this.#controlsElement);
    }

    #createRoiElement() {
      if (this.#roiElement) this.#roiElement.remove();
      this.#roiElement = document.createElement("div");
      this.#roiElement.id = "roi-selector";

      this.#roiElement.textContent = "더블클릭해서 팝업 열기";

      this.#roiElement.style.cssText = `
                position: absolute;
                border: 2px solid #32ff7e;
                background-color: rgba(50, 255, 126, 0.2);
                cursor: move;
                z-index: 1001;
                box-sizing: border-box;

                /* --- 텍스트 중앙 정렬 및 스타일을 위한 추가 CSS --- */
                display: flex;
                justify-content: center;
                align-items: center;
                color: white;
                font-weight: bold;
                font-size: 14px;
                text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
                text-align: center;
                padding: 5px; /* 텍스트가 너무 길어질 경우를 대비 */
            `;
      this.#videoContainer.appendChild(this.#roiElement);

      const resizeHandle = document.createElement("div");
      resizeHandle.style.cssText = `
                position: absolute; width: 15px; height: 15px; background-color: #32ff7e;
                right: -2px; bottom: -2px; cursor: se-resize;
            `;
      this.#roiElement.appendChild(resizeHandle);

      this.#makeDraggable(this.#roiElement);
      this.#makeResizable(this.#roiElement, resizeHandle);

      // 3. 더블클릭 이벤트는 그대로 유지합니다.
      this.#roiElement.addEventListener("dblclick", () => this.#openRoiInPopup());
    }

    #makeDraggable(element) {
      let offsetX, offsetY;
      const videoContainer = this.#videoContainer;
      const onMouseMove = (e) => {
        const containerRect = videoContainer.getBoundingClientRect();
        const newLeft = Math.max(0, Math.min(e.clientX - offsetX, containerRect.width - element.offsetWidth));
        const newTop = Math.max(0, Math.min(e.clientY - offsetY, containerRect.height - element.offsetHeight));
        element.style.left = `${newLeft}px`;
        element.style.top = `${newTop}px`;
      };

      element.addEventListener("mousedown", (e) => {
        if (e.target !== element) return;
        e.preventDefault();
        offsetX = e.clientX - element.offsetLeft;
        offsetY = e.clientY - element.offsetTop;
        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener(
          "mouseup",
          () => {
            document.removeEventListener("mousemove", onMouseMove);
            this.#debounceUpdateRoiSourceRect();
          },
          { once: true },
        );
      });
    }

    #makeResizable(element, handle) {
      let startX, startWidth;
      const videoContainer = this.#videoContainer;
      const onResizeMove = (e) => {
        const dx = e.clientX - startX;
        const containerRect = videoContainer.getBoundingClientRect();
        const newSize = Math.max(20, Math.min(startWidth + dx, containerRect.width - element.offsetLeft, containerRect.height - element.offsetTop));
        element.style.width = `${newSize}px`;
        element.style.height = `${newSize}px`;
      };

      handle.addEventListener("mousedown", (e) => {
        e.preventDefault();
        e.stopPropagation();
        startX = e.clientX;
        startWidth = parseInt(getComputedStyle(element).width, 10);
        document.addEventListener("mousemove", onResizeMove);
        document.addEventListener(
          "mouseup",
          () => {
            document.removeEventListener("mousemove", onResizeMove);
            this.#debounceUpdateRoiSourceRect();
          },
          { once: true },
        );
      });
    }

    #debounceUpdateRoiSourceRect() {
      if (this.#updateTimeout) clearTimeout(this.#updateTimeout);
      this.#updateTimeout = setTimeout(() => {
        this.#updateRoiSourceRect();
      }, 50);
    }

    #toggleRoiVisibility() {
      this.#isRoiActive = !this.#isRoiActive;

      if (this.#isRoiActive) {
        this.#playerElement.dataset.roiActive = "true";
      } else {
        delete this.#playerElement.dataset.roiActive;
      }

      if (this.#isRoiActive && !this.#roiElement.style.width) {
        this.#roiElement.style.width = "150px";
        this.#roiElement.style.height = "150px";
        this.#roiElement.style.top = "50px";
        this.#roiElement.style.left = "50px";
      }
    }

    #updateRoiSourceRect() {
      if (!this.#isRoiActive || !this.#panzoomInstance) return;

      const now = performance.now();
      if (now - this.#lastUpdateTime < 50) return; // Throttle updates
      this.#lastUpdateTime = now;

      const containerRect = this.#videoContainer.getBoundingClientRect();
      const roiRect = this.#roiElement.getBoundingClientRect();
      const pan = this.#panzoomInstance.getPan();
      const scale = this.#panzoomInstance.getScale();
      const { videoWidth, videoHeight } = this.#videoElement;

      if (videoWidth === 0 || videoHeight === 0) return;

      const videoRatio = videoWidth / videoHeight;
      const containerRatio = containerRect.width / containerRect.height;
      let renderedWidth,
        renderedHeight,
        offsetX = 0,
        offsetY = 0;

      // Recalculate rendered dimensions based on aspect ratio
      if (videoRatio > containerRatio) {
        renderedWidth = containerRect.width;
        renderedHeight = renderedWidth / videoRatio;
        offsetY = (containerRect.height - renderedHeight) / 2;
      } else {
        renderedHeight = containerRect.height;
        renderedWidth = renderedHeight * videoRatio;
        offsetX = (containerRect.width - renderedWidth) / 2;
      }

      // Calculate ROI source rectangle in video coordinates
      Object.assign(this.#roiSourceRect, {
        sx: ((roiRect.left - containerRect.left - offsetX - pan.x) / scale) * (videoWidth / renderedWidth),
        sy: ((roiRect.top - containerRect.top - offsetY - pan.y) / scale) * (videoHeight / renderedHeight),
        sWidth: (roiRect.width / scale) * (videoWidth / renderedWidth),
        sHeight: (roiRect.height / scale) * (videoHeight / renderedHeight),
      });

      // Ensure ROI coordinates are within video bounds
      this.#roiSourceRect.sx = Math.max(0, Math.min(this.#roiSourceRect.sx, videoWidth - this.#roiSourceRect.sWidth));
      this.#roiSourceRect.sy = Math.max(0, Math.min(this.#roiSourceRect.sy, videoHeight - this.#roiSourceRect.sHeight));
    }

    #openRoiInPopup() {
      if (!this.#roiElement || !this.#isRoiActive) return;

      this.#roiModal?.destroy();
      if (this.#drawLoopAnimationId) cancelAnimationFrame(this.#drawLoopAnimationId);

      this.#roiModal = new DraggableResizableModal("roi-zoom-popup", "실시간 확대 영상", {
        width: "450px",
        height: "490px",
        top: "100px",
        left: "100px",
      });
      const contentArea = this.#roiModal.getContentElement();
      contentArea.style.cssText = "padding: 0; display: flex; background-color: #000;";

      const popupCanvas = document.createElement("canvas");
      popupCanvas.style.cssText = "width: 100%; height: 100%;";
      contentArea.appendChild(popupCanvas);
      this.#roiModal.show();

      const popupCtx = popupCanvas.getContext("2d", { alpha: false });
      popupCtx.imageSmoothingEnabled = false;

      // ResizeObserver for popup canvas
      this.#resizeObserver?.disconnect();
      this.#resizeObserver = new ResizeObserver((entries) => {
        const { width, height } = entries[0].contentRect;
        popupCanvas.width = width;
        popupCanvas.height = height;
        this.#debounceUpdateRoiSourceRect(); // Ensure ROI is updated when popup resizes
      });
      this.#resizeObserver.observe(contentArea);

      const drawLoop = () => {
        if (!popupCanvas.isConnected) {
          this.#drawLoopAnimationId = null;
          return;
        }

        this.#updateRoiSourceRect(); // Update ROI coordinates in each frame
        const { sx, sy, sWidth, sHeight } = this.#roiSourceRect;
        const { width: canvasWidth, height: canvasHeight } = popupCanvas;
        const size = Math.min(canvasWidth, canvasHeight);
        const dx = (canvasWidth - size) / 2;
        const dy = (canvasHeight - size) / 2;

        popupCtx.clearRect(0, 0, canvasWidth, canvasHeight);
        popupCtx.drawImage(this.#videoElement, sx, sy, sWidth, sHeight, dx, dy, size, size);

        this.#drawLoopAnimationId = requestAnimationFrame(drawLoop);
      };
      this.#drawLoopAnimationId = requestAnimationFrame(drawLoop);
    }
  }

  const setupPlayerPanzoom = async (videoSelector, containerSelector, playerSelector) => {
    if (!isPlayerPanzoomEnabled) return;

    try {
      if (!window.Panzoom) {
        await loadScript("https://unpkg.com/@panzoom/panzoom@4.5.1/dist/panzoom.min.js");
      }
    } catch (error) {
      customLog.error("Panzoom 라이브러리 로드 실패:", error);
      return;
    }

    const rightCtrl = await waitForElementAsync("#player .player_ctrlBox .ctrlBox .right_ctrl");
    const videoElement = await waitForElementAsync(videoSelector);
    const videoContainer = await waitForElementAsync(containerSelector);
    const playerElement = await waitForElementAsync(playerSelector);

    if (!rightCtrl || !videoElement || !videoContainer || !playerElement) {
      customLog.error("Panzoom에 필요한 요소를 찾을 수 없습니다.");
      return;
    }

    // 이전 핸들러 및 버튼 정리
    panzoomHandlerInstance?.destroy();
    document.querySelector(".btn_panzoom_toggle")?.remove();

    panzoomHandlerInstance = new PlayerPanzoom(videoElement, videoContainer, playerElement);

    const toggleButton = document.createElement("button");
    toggleButton.type = "button";
    toggleButton.title = "영상 확대/이동";
    toggleButton.className = "btn_panzoom_toggle";
    toggleButton.innerHTML = `<svg viewBox="0 0 20 20" style="width: 20px; height: 20px; fill: currentColor;"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path></svg>`;
    toggleButton.style.color = "white";

    const advancedControlsBtn = rightCtrl.querySelector(".btn_advanced_controls");
    if (advancedControlsBtn) {
      rightCtrl.insertBefore(toggleButton, advancedControlsBtn);
    } else {
      rightCtrl.insertBefore(toggleButton, rightCtrl.firstChild);
    }

    toggleButton.addEventListener("click", (e) => {
      e.stopPropagation();
      if (panzoomHandlerInstance.isActive) {
        panzoomHandlerInstance.destroy();
        toggleButton.style.color = "white"; // 비활성 색상
      } else {
        panzoomHandlerInstance.init();
        toggleButton.style.color = "#4998fd"; // 활성 색상
      }
    });
  };

  //======================================
  // 4. 메인 실행 로직 (Main Execution Logic)
  //======================================
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      if (isChangeFontEnabled) applyFontStyles();
      loadCategoryData();
    });
  } else {
    if (isChangeFontEnabled) applyFontStyles();
    loadCategoryData();
  }

  // 4.1. 메인 페이지 실행 (sooplive.co.kr)
  if (CURRENT_URL.startsWith("https://www.sooplive.co.kr")) {
    GM_addStyle(CommonStyles);
    GM_addStyle(mainPageCommonStyles);
    if (isPreviewModalEnabled || isReplaceEmptyThumbnailEnabled || isPreviewModalFromSidebarEnabled) {
      loadHlsScript();
      previewModalManager = new PreviewModal();
      unsafeWindow.handleSidebarContextMenu = (element, event) => {
        previewModalManager.handleSidebarContextMenu(element, event);
      };
    }
    if (isCustomSidebarEnabled) document.body.classList.add("customSidebar");
    (async () => {
      const serviceLnbDiv = await waitForElementAsync("#serviceLnb");
      if (isCustomSidebarEnabled) makeTopNavbarAndSidebar("main");
      runCommonFunctions();
    })();
    removeUnwantedTags();
    processStreamers();

    return;
  }

  // 4.2. 플레이어 페이지 실행 (play.sooplive.co.kr)
  if (CURRENT_URL.startsWith("https://play.sooplive.co.kr")) {
    // Embed 페이지에서는 실행하지 않음
    const pattern = /^https:\/\/play.sooplive.co.kr\/.*\/.*\/embed(\?.*)?$/;
    if (pattern.test(CURRENT_URL) || CURRENT_URL.includes("vtype=chat")) {
      return;
    }
    GM_addStyle(CommonStyles);
    GM_addStyle(playerCommonStyles);
    hideBadges();
    compileBlockRules();
    if (isPreviewModalFromSidebarEnabled) {
      loadHlsScript();
      previewModalManager = new PreviewModal();
      unsafeWindow.handleSidebarContextMenu = (element, event) => {
        previewModalManager.handleSidebarContextMenu(element, event);
      };
    }
    if (isCustomSidebarEnabled) document.body.classList.add("customSidebar");
    if (isCustomSidebarEnabled) {
      makeTopNavbarAndSidebar("player");
      insertFoldButton();
      if (showSidebarOnScreenMode && !showSidebarOnScreenModeAlways) {
        showSidebarOnMouseOver();
      }
    }
    if (isBottomChatEnabled) useBottomChat();
    if (isMakePauseButtonEnabled) {
      appendPauseButton();
      observeUrlChanges(appendPauseButton);
    }
    if (isMakeSharpModeShortcutEnabled) toggleSharpModeShortcut();
    if (isMakeLowLatencyShortcutEnabled) toggleLowLatencyShortcut();
    if (isMakeQualityChangeShortcutEnabled) initializeQualityShortcuts();
    if (isRemainingBufferTimeEnabled) {
      (async () => {
        const livePlayerDiv = await waitForElementAsync("#livePlayer");
        insertRemainingBuffer(livePlayerDiv);
      })();
    }
    if (isCaptureButtonEnabled) {
      makeCaptureButton();
    }
    if (isAutoClaimGemEnabled) {
      setInterval(autoClaimGem, 30000);
    }
    if (isVideoSkipHandlerEnabled) {
      (async () => {
        const livePlayerDiv = await waitForElementAsync("#livePlayer");
        window.addEventListener("keydown", videoSkipHandler);
      })();
    }
    registerVisibilityChangeHandler();
    registerVisibilityChangeHandlerForQuality();

    if (isNo1440pEnabled) {
      downgradeFrom1440p();
      observeUrlChanges(() => {
        setTimeout(downgradeFrom1440p, 4000);
      });
    }

    checkPlayerPageHeaderAd();
    if (!isOpenNewtabEnabled) {
      homePageCurrentTab();
    }
    if (isDocumentTitleUpdateEnabled) {
      setTimeout(updateTitleWithViewers, 10000);
      setInterval(updateTitleWithViewers, 60000);
    }
    runCommonFunctions();

    if (isUnlockCopyPasteEnabled) {
      (async () => {
        const writeArea = await waitForElementAsync("#write_area");
        unlockCopyPaste(writeArea);
      })();
    }

    if (isAlignNicknameRightEnabled) {
      alignNicknameRight();
    }

    if (isAutoScreenModeEnabled) {
      (async () => {
        const btnScreenModeDiv = await waitForElementAsync("#livePlayer");
        if (!document.body.classList.contains("screen_mode")) {
          document.body.querySelector("#player .btn_screen_mode").click();
        }
      })();
    }

    if (isClickPlayerEventMapperEnabled) {
      async function initializePlayerControls() {
        const player = await waitForElementAsync("#player");
        const video = await waitForElementAsync("#livePlayer");

        if (!player || !video) {
          customLog.error("플레이어 또는 비디오 요소를 찾을 수 없어 시스템을 시작할 수 없습니다.");
          return;
        }

        const pauseSelector = document.querySelector("#closeStream") ? "#closeStream" : "#time_shift_play";

        const buttonSelectors = {
          mute: "#btn_sound",
          pause: pauseSelector,
          stop: "#play",
          screenMode: ".btn_screen_mode",
          fullscreen: ".btn_fullScreen_mode",
        };

        const mapper = new PlayerEventMapper(player, video, buttonSelectors);

        mapper.player.addEventListener("mapper-ready", () => {
          mapper.applyConfiguration(USER_CLICK_CONFIG);
        });
      }

      // 스크립트 실행
      initializePlayerControls();
    }

    if (ishideButtonsAboveChatInputEnabled) {
      hideButtonsAboveChatInput();
    }

    if (isExpandLiveChatAreaEnabled) {
      setupExpandLiveChatFeature();
    }

    if (isShowDeletedMessagesEnabled || isShowSelectedMessagesEnabled) {
      (async () => {
        const chattingItemWrapDiv = await waitForElementAsync(".chatting-item-wrap");
        setupChatMessageTrackers(chattingItemWrapDiv);
      })();
      observeUrlChanges(() => {
        unsafeWindow.resetChatData();
      });
    }

    if (isNoAutoVODEnabled) {
      let redirectRetryTimer = null;
      let disconnectUrlObserver = null;

      const tabManager = createTabSyncManager({
        urlPattern: "play.sooplive.co.kr/{userId}/{broadcastId}",
      });
      const cancelAutoRedirectRetry = () => {
        if (redirectRetryTimer) {
          clearTimeout(redirectRetryTimer); // 예약된 setTimeout을 취소
          redirectRetryTimer = null; // 타이머 ID 변수 초기화
          customLog.log("사용자 활동이 감지되어 자동 전환 재시도를 중단합니다.");
        }
      };
      /**
       * 지정된 기준에 따라 다음 라이브 방송으로 전환하는 함수 (안전 장치 및 재시도 로직 추가됨)
       * @param {number} retryCount - 현재까지의 재시도 횟수
       */
      async function redirectLiveWithTabCheck(retryCount = 0) {
        // --- 설정 변수 ---
        const MAX_RETRIES = 100; // 최대 재시도 횟수
        const RETRY_DELAY_MS = 10000; // 재시도 사이의 대기 시간 (10초)
        const LOCK_KEY = "auto_redirect_lock";
        const LOCK_TIMEOUT_MS = 10000; // 잠금 유효 시간 (10초)

        // 1. 최대 재시도 횟수를 초과하면 실행을 완전히 중단합니다.
        if (retryCount >= MAX_RETRIES) {
          customLog.log(`최대 재시도 횟수(${MAX_RETRIES}회)를 초과하여 자동 전환을 중단합니다.`);
          return;
        }

        try {
          const now = Date.now();
          const lockTimestamp = localStorage.getItem(LOCK_KEY);

          // 2. 다른 탭이 유효한 잠금을 가지고 있는지 확인합니다.
          if (lockTimestamp && now - parseInt(lockTimestamp, 10) < LOCK_TIMEOUT_MS) {
            customLog.log(`다른 탭에서 자동 전환 진행 중... ${RETRY_DELAY_MS / 1000}초 후 재시도합니다. (시도 ${retryCount + 1}/${MAX_RETRIES})`);
            // 재시도 로직: 일정 시간 대기 후, 재시도 횟수를 늘려 다시 함수를 호출합니다.
            redirectRetryTimer = setTimeout(() => redirectLiveWithTabCheck(retryCount + 1), RETRY_DELAY_MS);
            return; // 현재 실행은 중단하고, 예약된 다음 시도를 기다립니다.
          }

          // 3. 유효한 잠금이 없으므로, 현재 탭이 잠금을 획득하고 리디렉션을 시작합니다.
          customLog.log("잠금을 획득하여 자동 전환을 시작합니다.");
          localStorage.setItem(LOCK_KEY, now.toString());

          const sortMethod = redirectLiveSortOption;
          customLog.log(`방송 종료. 다음 방송 자동 전환을 시작합니다. (선택 기준: ${sortMethod})`);
          const favoriteData = await fetchBroadList("https://myapi.sooplive.co.kr/api/favorite", 50);

          let potentialTargets = getPrioritizedLiveBroadcasts(favoriteData);

          if (!potentialTargets.length) {
            customLog.log("자동으로 전환할 라이브 방송을 찾지 못했습니다.");
            localStorage.removeItem(LOCK_KEY); // 전환할 방송이 없으므로 잠금 해제
            return;
          }

          // ... (정렬 로직은 이전과 동일) ...
          switch (sortMethod) {
            case "mostViewers":
              potentialTargets.sort((a, b) => (b.total_view_cnt || 0) - (a.total_view_cnt || 0));
              customLog.log("시청자 많은 순으로 후보 목록을 정렬했습니다.");
              break;
            case "leastViewers":
              potentialTargets.sort((a, b) => (a.total_view_cnt || 0) - (b.total_view_cnt || 0));
              customLog.log("시청자 적은 순으로 후보 목록을 정렬했습니다.");
              break;
            case "random":
              for (let i = potentialTargets.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [potentialTargets[i], potentialTargets[j]] = [potentialTargets[j], potentialTargets[i]];
              }
              customLog.log("후보 목록을 무작위로 섞었습니다.");
              break;
            case "custom":
            default:
              customLog.log("기존 우선순위(고정/알림/일반)를 사용합니다.");
              break;
          }

          customLog.log(`전환할 후보 방송: ${potentialTargets.length}개`);

          for (const target of potentialTargets) {
            const userId = target.user_id;
            const broadcastId = target.broad_no;

            if (!userId || !broadcastId) {
              continue;
            }

            const isAlreadyOpen = tabManager.isTargetTabOpen(userId, broadcastId);

            if (!isAlreadyOpen) {
              customLog.log(`다음 우선순위 방송[${userId}/${broadcastId}]을 찾았습니다. 전환합니다.`);
              // 리디렉션이 성공하면 이 탭의 스크립트 실행은 중단됩니다.
              // 잠금은 타임아웃으로 자동 해제됩니다.
              unsafeWindow.liveView.playerController.sendLoadBroad(userId, broadcastId);
              return;
            } else {
              customLog.log(`방송[${userId}/${broadcastId}]은(는) 이미 열려있어 건너뜁니다. 다음 우선순위를 확인합니다.`);
            }
          }

          customLog.log("모든 우선순위의 라이브 방송이 이미 열려있습니다. 전환하지 않습니다.");
          localStorage.removeItem(LOCK_KEY); // 모든 작업이 끝났으므로 잠금 해제
        } catch (error) {
          customLog.error("다음 방송 자동 전환 중 오류가 발생했습니다:", error);
          localStorage.removeItem(LOCK_KEY); // 오류 발생 시에도 잠금 해제
        }
      }

      function disableAutoVOD() {
        const container = unsafeWindow.liveView?.aContainer?.[1];

        if (container?.autoPlayVodBanner) {
          if (isRedirectLiveEnabled === 1) {
            container.autoPlayVodBanner.show = redirectLiveWithTabCheck;
            if (!disconnectUrlObserver) {
              disconnectUrlObserver = observeUrlChanges(cancelAutoRedirectRetry);
            }
            customLog.log("자동 LIVE 전환 기능 활성화");
          } else {
            container.autoPlayVodBanner.show = () => {
              customLog.log("VOD 자동 재생 비활성화");
            };
          }
        } else {
          setTimeout(disableAutoVOD, 3000);
        }
      }
      disableAutoVOD();
    }

    if (isHideEsportsInfoEnabled) {
      GM_addStyle(`
              body:not(.screen_mode,.fullScreen_mode,.embeded_mode)
              #webplayer #webplayer_contents #player_area
              .broadcast_information.detail_open .esports_info {
                    display: none !important;
              }
              .broadcast_information .esports_info {
                    display: none !important;
              }
              `);
    }

    if (isRedirectLiveEnabled) {
      const tabManager = createTabSyncManager({
        urlPattern: "https://play.sooplive.co.kr/{userId}/{broadcastId}",
      });
    }

    if (isPlayerAdvancedControlsLiveEnabled) {
      let advControlsInstance = null;
      const initAdvControls = async () => {
        try {
          advControlsInstance?.destroy();
          const videoElement = await waitForElementAsync("#livePlayer");
          advControlsInstance = new PlayerAdvancedControls(videoElement);
        } catch (e) {
          customLog.error("고급 컨트롤 초기화 실패:", e);
        }
      };
      initAdvControls();
      observeUrlChanges(() => {
        setTimeout(initAdvControls, 2000);
      });
    }

    if (isPlayerPanzoomEnabled) {
      const initPanzoom = () => setupPlayerPanzoom("#livePlayer", "#videoLayer", "#player");
      initPanzoom();
      observeUrlChanges(() => {
        setTimeout(initPanzoom, 2000);
      });
    }

    return;
  }

  // 4.3. VOD 페이지 실행 (vod.sooplive.co.kr)
  if (CURRENT_URL.startsWith("https://vod.sooplive.co.kr/player/")) {
    const isBaseUrl = (url) => /https:\/\/vod\.sooplive\.co\.kr\/player\/\d+/.test(url) && !isCatchUrl(url);
    const isCatchUrl = (url) => /https:\/\/vod\.sooplive\.co\.kr\/player\/\d+\/catch/.test(url) || /https:\/\/vod\.sooplive\.co\.kr\/player\/catch/.test(url);

    // 다시보기 페이지
    if (isBaseUrl(CURRENT_URL)) {
      GM_addStyle(CommonStyles);
      hideBadges();
      compileBlockRules();

      const waitForVodMediaInfo = async () => {
        try {
          const vodCore = await waitForVariable("vodCore");
          const mediaInfo = await new Promise((resolve, reject) => {
            const MEDIA_INFO_TIMEOUT = 15000;
            const timer = setInterval(() => {
              const info = vodCore.playerController?._currentMediaInfo;
              if (info?.name) {
                clearTimeout(timeoutHandle);
                clearInterval(timer);
                resolve(info);
              }
            }, 1000);
            const timeoutHandle = setTimeout(() => {
              clearInterval(timer); // 불필요한 인터벌 중지
              reject(new Error("미디어 정보(mediaInfo) 로딩 시간을 초과했습니다."));
            }, MEDIA_INFO_TIMEOUT);
          });
          checkMediaInfo(mediaInfo.name, mediaInfo.isAutoLevelEnabled);
        } catch (error) {
          customLog.error("VOD 플레이어 초기화에 실패했습니다:", error);
        }
      };

      if (isVODChatScanEnabled) {
        let scannerInstance = null;
        function initVODChatScanApp() {
          waitForVariable("vodCore")
            .then((vodCore) => {
              const STREAMER_ID_LIST = targetUserIdSet;
              scannerInstance = new StreamerActivityScanner(vodCore, STREAMER_ID_LIST);
            })
            .catch(customLog.error);
        }
        initVODChatScanApp();
        observeUrlChanges(() => {
          scannerInstance?.destroy(); // 기존 인스턴스 파괴
          scannerInstance = null;
          setTimeout(initVODChatScanApp, 2000);
        });
      }

      if (isVODHighlightEnabled) {
        let highlightScannerInstance = null;
        async function initHighlightScanApp() {
          try {
            const vodCore = await waitForVariable("vodCore");
            const titleNo = vodCore.config.titleNo || vodCore.config.title_no;
            const mobileApiUrl = "https://api.m.sooplive.co.kr/station/video/a/view";
            const params = new URLSearchParams({ nTitleNo: titleNo, nApiLevel: 11, nPlaylistIdx: 0 });
            const response = await fetch(mobileApiUrl, { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: params.toString(), credentials: "include" });
            const videoData = await response.json();
            if (videoData.result !== 1 || !videoData.data.bbs_no) {
              throw new Error(`모바일 API에서 bbs_no를 가져오는 데 실패했습니다: ${videoData.message || "알 수 없는 오류"}`);
            }
            const bbsNo = videoData.data.bbs_no;
            highlightScannerInstance?.destroy();
            highlightScannerInstance = new VODHighlightScanner(vodCore, bbsNo);
          } catch (err) {
            customLog.error("VOD 스캐너 초기화 실패:", err);
            highlightScannerInstance?.destroy();
          }
        }

        initHighlightScanApp();
        observeUrlChanges(() => {
          highlightScannerInstance?.destroy();
          setTimeout(initHighlightScanApp, 1000);
        });
      }

      if (isSelectBestQualityEnabled) {
        waitForVodMediaInfo();
        observeUrlChanges(() => {
          setTimeout(waitForVodMediaInfo, 2000);
        });
      }
      if (isCaptureButtonEnabled) {
        makeCaptureButton();
      }

      // VOD 채팅창
      (async () => {
        const webplayerContentsDiv = await waitForElementAsync("#webplayer_contents");
        observeChatForBlockingWords("#webplayer_contents", webplayerContentsDiv);
      })();

      if (isPlayerAdvancedControlsVODEnabled) {
        let advControlsInstance = null;

        const initAdvControlsForVOD = () => {
          waitForVariable("vodCore")
            .then(() => waitForElementAsync(".right_ctrl"))
            .then(() => waitForElementAsync("#video"))
            .then((videoElement) => {
              try {
                advControlsInstance?.destroy();
                advControlsInstance = new PlayerAdvancedControls(videoElement);
              } catch (e) {
                customLog.error("VOD 고급 컨트롤 초기화 실패:", e);
              }
            })
            .catch((e) => {
              customLog.error("vodCore 또는 필요한 요소 로딩 실패:", e);
            });
        };

        observeWithReinit(initAdvControlsForVOD);
      }

      if (isPlayerPanzoomVODEnabled) {
        const initPanzoomForVOD = () => {
          waitForVariable("vodCore")
            .then((vodCore) => {
              waitForElementAsync("#video").then((videoElement) => {
                setupPlayerPanzoom("#video", "#videoLayer", "#player");
              });
            })
            .catch((e) => {
              customLog.error("vodCore 또는 video 로딩 실패:", e);
            });
        };

        observeWithReinit(initPanzoomForVOD);
      }

      setupSettingButtonTopbar();

      if (isAlignNicknameRightEnabled) {
        alignNicknameRight();
      }
      if (isExpandVODChatAreaEnabled) {
        setupExpandVODChatFeature();
      }
      if (isMonthlyRecapEnabled) observeAndAppendRecapButton();

      // 캐치 페이지
    } else if (isCatchUrl(CURRENT_URL)) {
      GM_addStyle(CommonStyles);
      GM_addStyle(mainPageCommonStyles);
      if (isCustomSidebarEnabled) document.body.classList.add("customSidebar");
      (async () => {
        const serviceLnbDiv = await waitForElementAsync("#serviceLnb");
        if (isCustomSidebarEnabled) makeTopNavbarAndSidebar("main");
        runCommonFunctions();
      })();
      if (isRemoveShadowsFromCatchEnabled) addStyleRemoveShadowsFromCatch();
    }
  }

  if (CURRENT_URL.startsWith("https://ch.sooplive.co.kr/")) {
    if (window.location.search.includes("iframe=true")) {
      GM_addStyle(`
            #bs-navi, #af-header, .bs-infomation {
                display: none !important;
            }
            #contents_wrap, #bs-contents, #bs-container {
                width: 650px !important;
                padding: 0 !important;
                margin: 0 !important;
            }
            #bs-container, #contents, .post_detail {
                width: 650px !important;
                max-width: 650px !important;
            }
            .post_detail * {
                max-width: 650px !important;
            }
            `);
      return;
    }
  }
})();

import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

const NaverMap = () => {
  const [map, setMap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [markers, setMarkers] = useState([]);

  // GPS 관련 상태 추가
  const [currentLocation, setCurrentLocation] = useState(null);
  const [currentLocationMarker, setCurrentLocationMarker] = useState(null);
  const [gpsEnabled, setGpsEnabled] = useState(false);
  const watchIdRef = useRef(null);

  // 브랜치 데이터 가져오기 - BranchController의 엔드포인트 사용
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        console.log("지점 데이터 요청 시작");
        const response = await axios.get("emart/admin/branch/all");
        console.log("지점 데이터 응답:", response.data);
        setBranches(response.data);
      } catch (err) {
        console.error("지점 데이터 로드 실패:", err);
        setError("지점 데이터를 불러오는데 실패했습니다.");
      }
    };

    fetchBranches();
  }, []);

  // 네이버 맵 초기화
  useEffect(() => {
    const initMap = () => {
      // 네이버 맵 스크립트 로드
      const script = document.createElement("script");
      script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${process.env.REACT_APP_NAVER_CLIENT_ID}&submodules=geocoder`;
      script.async = true;

      script.onload = () => {
        const mapOptions = {
          center: new window.naver.maps.LatLng(35.1796, 129.0756), // 부산 중심 좌표
          zoom: 11,
          zoomControl: true,
          zoomControlOptions: {
            position: window.naver.maps.Position.TOP_RIGHT,
          },
        };

        const newMap = new window.naver.maps.Map("map", mapOptions);
        setMap(newMap);
        setLoading(false);
      };

      script.onerror = (error) => {
        console.error("스크립트 로드 실패:", error);
        setError("네이버 지도 로딩 실패");
        setLoading(false);
      };

      document.body.appendChild(script);
    };

    initMap();

    // 컴포넌트 언마운트 시 위치 추적 중지
    return () => {
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  // GPS 기능 활성화/비활성화 토글 함수
  const toggleGPS = () => {
    if (gpsEnabled) {
      // GPS 비활성화
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }

      // 현재 위치 마커 제거
      if (currentLocationMarker) {
        currentLocationMarker.setMap(null);
        setCurrentLocationMarker(null);
      }

      // 현재 위치 상태 초기화
      setCurrentLocation(null);
      setGpsEnabled(false);

      console.log("GPS 비활성화됨, 마커 제거됨");
    } else {
      // GPS 활성화
      startGPSTracking();
    }
  };

  // GPS 추적 시작 함수
  const startGPSTracking = () => {
    if (!navigator.geolocation) {
      alert("이 브라우저에서는 위치 정보를 지원하지 않습니다.");
      return;
    }

    setGpsEnabled(true);

    const options = {
      enableHighAccuracy: true, // 높은 정확도 사용
      timeout: 10000, // 10초 타임아웃
      maximumAge: 0, // 캐시된 위치 정보 사용 안 함
    };

    // 위치 추적 시작
    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const latLng = new window.naver.maps.LatLng(latitude, longitude);

        setCurrentLocation(latLng);

        // 맵이 로드되었는지 확인
        if (map) {
          // 현재 위치로 지도 중심 이동
          map.setCenter(latLng);

          // 현재 위치 마커 생성 또는 업데이트
          if (currentLocationMarker) {
            currentLocationMarker.setPosition(latLng);
          } else {
            // 개선된 현재 위치 마커 디자인
            const markerContent = document.createElement("div");
            markerContent.innerHTML = `
              <div style="
                position: relative;
                width: 24px;
                height: 24px;
              ">
                <!-- 외부 링 애니메이션 -->
                <div style="
                  position: absolute;
                  width: 40px;
                  height: 40px;
                  border-radius: 50%;
                  background: rgba(28, 100, 242, 0.1);
                  transform: translate(-50%, -50%);
                  left: 50%;
                  top: 50%;
                  animation: pulse-outer 2s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite;
                "></div>
                
                <!-- 중간 링 애니메이션 -->
                <div style="
                  position: absolute;
                  width: 30px;
                  height: 30px;
                  border-radius: 50%;
                  background: rgba(28, 100, 242, 0.2);
                  transform: translate(-50%, -50%);
                  left: 50%;
                  top: 50%;
                  animation: pulse-middle 2s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite;
                "></div>
                
                <!-- 중심 마커 -->
                <div style="
                  position: absolute;
                  width: 14px;
                  height: 14px;
                  background: #1C64F2;
                  border-radius: 50%;
                  transform: translate(-50%, -50%);
                  left: 50%;
                  top: 50%;
                  border: 2px solid white;
                  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
                "></div>
              </div>
              
              <style>
                @keyframes pulse-outer {
                  0% {
                    transform: translate(-50%, -50%) scale(0.8);
                    opacity: 0.8;
                  }
                  70% {
                    transform: translate(-50%, -50%) scale(1.2);
                    opacity: 0;
                  }
                  100% {
                    transform: translate(-50%, -50%) scale(0.8);
                    opacity: 0;
                  }
                }
                
                @keyframes pulse-middle {
                  0% {
                    transform: translate(-50%, -50%) scale(0.8);
                    opacity: 0.6;
                  }
                  50% {
                    transform: translate(-50%, -50%) scale(1.1);
                    opacity: 0.2;
                  }
                  100% {
                    transform: translate(-50%, -50%) scale(0.8);
                    opacity: 0.6;
                  }
                }
              </style>
            `;

            const newMarker = new window.naver.maps.Marker({
              position: latLng,
              map: map,
              icon: {
                content: markerContent,
                anchor: new window.naver.maps.Point(12, 12),
              },
              zIndex: 1000, // 다른 마커보다 위에 표시
            });

            setCurrentLocationMarker(newMarker);
          }
        }
      },
      (error) => {
        let errorMessage;
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "위치 정보 접근 권한이 거부되었습니다.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "위치 정보를 사용할 수 없습니다.";
            break;
          case error.TIMEOUT:
            errorMessage = "위치 정보 요청이 시간 초과되었습니다.";
            break;
          default:
            errorMessage = "알 수 없는 오류";
            break;
        }

        console.error("GPS 오류:", errorMessage);
        alert(errorMessage);
        setGpsEnabled(false);
      },
      options
    );
  };

  // 정확한 위도/경도로 지도 이동 및 확대하는 함수
  const moveAndZoomToLocation = (exactLat, exactLng) => {
    if (!map) return;

    console.log("정확한 위치로 이동:", exactLat, exactLng);

    // 정확한 좌표로 지도 위치 이동
    const targetPoint = new window.naver.maps.LatLng(exactLat, exactLng);

    // 현재 줌 레벨 확인
    const currentZoom = map.getZoom();
    const targetZoom = 16; // 목표 줌 레벨 - 15에서 16으로 더 세밀하게 조정

    // 정확한 좌표로 중심 이동 (애니메이션 효과 적용)
    // setCenter로 정확히 중심 이동
    map.setCenter(targetPoint);

    // 필요한 경우 줌 레벨 조정
    if (currentZoom < targetZoom) {
      setTimeout(() => {
        map.setZoom(targetZoom, {
          animation: window.naver.maps.Animation.EASING,
        });
      }, 100);
    }
  };

  // 브랜치 데이터를 사용하여 마커 생성
  useEffect(() => {
    if (map && branches.length > 0) {
      // 기존 마커 제거
      markers.forEach((marker) => {
        marker.setMap(null);
      });

      const newMarkers = [];

      // 마커 겹침 방지를 위한 변수
      const markerGridSize = 0.0005; // 격자 크기 (위도/경도 단위)
      const occupiedPositions = {}; // 이미 사용된 위치 추적

      branches.forEach((branch) => {
        if (branch.latitude && branch.longitude) {
          // 원래 위치 (정확한 좌표)
          const exactLat = parseFloat(branch.latitude);
          const exactLng = parseFloat(branch.longitude);

          // 위치 키 생성 (격자화된 위치) - 마커 표시용
          let gridLat = Math.round(exactLat / markerGridSize) * markerGridSize;
          let gridLng = Math.round(exactLng / markerGridSize) * markerGridSize;
          let posKey = `${gridLat},${gridLng}`;

          // 이미 사용된 위치라면 근처에서 빈 공간 찾기
          if (occupiedPositions[posKey]) {
            // 나선형 탐색을 위한 방향 배열
            const directions = [
              [0, 1],
              [1, 0],
              [0, -1],
              [-1, 0], // 동, 남, 서, 북
              [1, 1],
              [1, -1],
              [-1, -1],
              [-1, 1], // 대각선 방향
            ];

            // 가장 가까운 빈 위치 찾기
            let found = false;
            for (let distance = 1; distance <= 3 && !found; distance++) {
              for (
                let dirIndex = 0;
                dirIndex < directions.length && !found;
                dirIndex++
              ) {
                const [dy, dx] = directions[dirIndex];
                const newGridLat = gridLat + dy * markerGridSize * distance;
                const newGridLng = gridLng + dx * markerGridSize * distance;
                const newPosKey = `${newGridLat},${newGridLng}`;

                if (!occupiedPositions[newPosKey]) {
                  gridLat = newGridLat;
                  gridLng = newGridLng;
                  posKey = newPosKey;
                  found = true;
                }
              }
            }
          }

          // 위치 점유 표시
          occupiedPositions[posKey] = true;

          // 격자화된 위치로 마커 위치 설정 (겹침 방지)
          const markerPosition = new window.naver.maps.LatLng(gridLat, gridLng);

          // 지점명 우측 4글자만 표시하도록 처리
          const shortBranchName =
            branch.branchName.length > 4
              ? branch.branchName.slice(-4)
              : branch.branchName;

          // 마커 크기와 디자인 설정
          const markerWidth = 120;

          // 심플한 마커 디자인 (재고 관련 요소 제거)
          const markerContent = document.createElement("div");
          markerContent.className = "branch-marker";
          markerContent.innerHTML = `
          <div style="position: relative; width: ${markerWidth}px; text-align: center; transform: translateY(-10px);" data-branch="${branch.branchName}" data-exact-lat="${exactLat}" data-exact-lng="${exactLng}">
            <div class="marker-bubble" style="
              position: relative;
              background-color: white;
              border-radius: 8px;
              box-shadow: 0 3px 12px rgba(0, 0, 0, 0.1);
              padding: 8px 10px;
              display: flex;
              align-items: center;
              transition: all 0.3s ease;
              border: 1px solid rgba(0, 0, 0, 0.05);
            ">
              <!-- 매장 아이콘 -->
              <div style="
                min-width: 28px;
                height: 28px;
                border-radius: 6px;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-right: 8px;
                background-color: #f0f9ff;
                color: #0369a1;
              ">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
              </div>
              
              <!-- 지점명 -->
              <div style="
                text-align: left;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
              ">
                <div style="
                  font-size: 16px;
                  font-weight: 600;
                  color: #374151;
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
                ">
                  ${shortBranchName}
                </div>
              </div>
            </div>
            
            <!-- 삼각형 꼬리 -->
            <div style="
              position: absolute;
              left: 50%;
              bottom: -8px;
              transform: translateX(-50%) rotate(45deg);
              width: 12px;
              height: 12px;
              background-color: white;
              border-right: 1px solid rgba(0, 0, 0, 0.05);
              border-bottom: 1px solid rgba(0, 0, 0, 0.05);
              box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.02);
            "></div>
          </div>
          
          <style>
            .branch-marker {
              transform-origin: bottom center;
              transition: transform 0.3s ease;
            }
            
            .branch-marker:hover {
              transform: scale(1.05);
              z-index: 999 !important;
            }
            
            .branch-marker:hover .marker-bubble {
              box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
              transform: translateY(-3px);
            }
          </style>
        `;

          const marker = new window.naver.maps.Marker({
            position: markerPosition,
            map: map,
            icon: {
              content: markerContent,
              anchor: new window.naver.maps.Point(markerWidth / 2, 10), // 마커 앵커 위치 동적 조정
            },
            zIndex: 50, // 기본 z-index 설정
          });

          // 마커 클릭 이벤트
          window.naver.maps.Event.addListener(marker, "click", () => {
            // 지점 상세 정보 가져오기
            fetchBranchDetail(branch.branchName);

            // 정확한 원본 좌표로 지도 이동 및 확대
            moveAndZoomToLocation(exactLat, exactLng);

            // 선택된 마커를 맨 앞으로 가져오기
            markers.forEach((m) => {
              const element = m.getElement();
              if (element) {
                const markerDiv = element.querySelector(".branch-marker > div");
                if (markerDiv) {
                  const branchName = markerDiv.getAttribute("data-branch");
                  if (branchName === branch.branchName) {
                    m.setZIndex(1000); // 선택된 마커의 z-index를 높임
                  } else {
                    m.setZIndex(50); // 다른 마커는 기본 z-index로 복원
                  }
                }
              }
            });
          });

          newMarkers.push(marker);
        }
      });

      setMarkers(newMarkers);
    }
  }, [map, branches]);

  // 특정 지점 상세 정보 가져오기
  const fetchBranchDetail = async (branchName) => {
    try {
      // 지점 목록에서 선택된 지점 정보 찾기
      const selectedBranch = branches.find((b) => b.branchName === branchName);
      if (selectedBranch) {
        setSelectedBranch(selectedBranch);
      }
    } catch (err) {
      console.error("지점 상세 정보 로드 실패:", err);
      setError("지점 상세 정보를 불러오는데 실패했습니다.");
    }
  };

  return (
    <div className="h-full w-full">
      {/* 지도 컨테이너 */}
      <div className="relative w-full h-full md:h-80 lg:h-96 rounded-lg overflow-hidden shadow-md">
        {loading && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 bg-white bg-opacity-80 p-4 rounded-lg font-bold">
            로딩 중...
          </div>
        )}

        {error && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 bg-red-50 p-4 rounded-lg text-red-600 font-bold">
            {error}
          </div>
        )}

        <div id="map" className="w-full h-full"></div>

        {/* 개선된 GPS 버튼 */}
        {map && !loading && (
          <div className="absolute bottom-4 right-4 z-20">
            <button
              onClick={toggleGPS}
              className={`flex items-center justify-center w-10 h-10 rounded-full shadow-lg focus:outline-none transition-all duration-300 ${
                gpsEnabled
                  ? "bg-blue-500 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
              title={gpsEnabled ? "GPS 끄기" : "내 위치 찾기"}
              style={{
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M19.94 11A8 8 0 0 0 12.94 4"></path>
                <path d="M4.06 11a8 8 0 0 1 7-7"></path>
                <path d="M4.06 13a8 8 0 0 0 7 7"></path>
                <path d="M19.94 13a8 8 0 0 1-7 7"></path>
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* 선택된 지점 정보 - 아이콘 왼쪽, 텍스트 중앙 정렬 (재고 정보 제거) */}
      {selectedBranch && (
        <div className="p-5 border border-gray-100 rounded-lg shadow-md bg-white mt-4 overflow-hidden">
          <div className="flex items-start mb-3">
            <div className="bg-black text-white p-3 rounded-md mr-4 flex items-center justify-center flex-shrink-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
            </div>
            <div className="flex-1 text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-1">
                {selectedBranch.branchName}
              </h3>
              <div className="flex items-center justify-center text-gray-500 text-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-1"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <p>{selectedBranch.branchAddress}</p>

                {/* 주소 저장 버튼 */}
                <button
                  onClick={() => {
                    try {
                      // 클립보드에 주소 복사
                      navigator.clipboard.writeText(
                        selectedBranch.branchAddress
                      );

                      // 알림 표시 (선택적)
                      alert(
                        `"${selectedBranch.branchName}" 주소가 클립보드에 복사되었습니다.`
                      );
                    } catch (err) {
                      console.error("주소 복사 실패:", err);
                      alert("주소 복사에 실패했습니다.");
                    }
                  }}
                  className="ml-2 text-gray-400 hover:text-black transition-colors focus:outline-none"
                  title="주소 복사"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect
                      x="9"
                      y="9"
                      width="13"
                      height="13"
                      rx="2"
                      ry="2"
                    ></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NaverMap;

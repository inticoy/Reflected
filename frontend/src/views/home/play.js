import { navigateTo } from "../../utils/display.js";

export function setPlayButtons() {
  document.getElementById("gameroom-jukim2").addEventListener("click", () => {
    navigateTo("app-gameroom");
  });

  document.getElementById("game-start").addEventListener("click", () => {
    navigateTo("app-game");
    initializeGame(); // 게임 초기화 함수 호출
  });

  document.addEventListener("keydown", function (event) {
    const slider = document.getElementById("my-slider");
    const step = 3; // 이동 단위 (%)

    // 현재 left 값을 가져와서 %로 변환
    let currentLeft = parseFloat(window.getComputedStyle(slider).left);
    let parentWidth = slider.parentElement.clientWidth;

    // 현재 left 값의 %를 계산
    let leftPercent = (currentLeft / parentWidth) * 100;

    if (event.key === "ArrowLeft") {
      // 왼쪽 화살표 키를 눌렀을 때
      leftPercent = Math.max(leftPercent - step, 10); // 최소 10%
    } else if (event.key === "ArrowRight") {
      // 오른쪽 화살표 키를 눌렀을 때
      leftPercent = Math.min(leftPercent + step, 90); // 최대 90%
    }

    // left 값을 %로 설정
    slider.style.left = leftPercent + "%";
  });
}

let ballDirectionX;
let ballDirectionY;

// 공의 크기 비율 (부모 요소에 대한 %)
const ballWidthPercent = 4.5; // 가로 사이즈 (부모의 4.5%)
const ballHeightPercent = 3; // 세로 사이즈 (부모의 3%)

function initializeGame() {
  const ball = document.getElementById("ball");

  // 공의 초기 위치를 화면 중앙으로 설정
  ball.style.top = "50%";
  ball.style.left = "50%";

  // 공의 초기 속도 및 방향 설정 (랜덤)
  ballDirectionX = (Math.random() < 0.5 ? -1 : 1) * (Math.random() * 2 + 1);
  ballDirectionY = (Math.random() < 0.5 ? -1 : 1) * (Math.random() * 2 + 1);

  moveBall(); // 공 움직임 시작
}

function moveBall() {
  const ball = document.getElementById("ball");
  const container = document.getElementById("game-container");

  // 부모 요소의 크기
  const containerWidth = container.clientWidth;
  const containerHeight = container.clientHeight;

  // 공의 크기를 %로 설정
  const ballWidthPx = (containerWidth * ballWidthPercent) / 100;
  const ballHeightPx = (containerHeight * ballHeightPercent) / 100;

  ball.style.width = ballWidthPercent + "%";
  ball.style.height = ballHeightPercent + "%";

  // 공의 현재 위치를 %로 가져오기
  let currentTopPercent = parseFloat(window.getComputedStyle(ball).top) || 50;
  let currentLeftPercent = parseFloat(window.getComputedStyle(ball).left) || 50;

  // 이동 속도 조절
  const speed = 0.5;

  // 새로운 위치 계산
  let newTopPercent = currentTopPercent + ballDirectionY * speed;
  let newLeftPercent = currentLeftPercent + ballDirectionX * speed;

  // 화면 경계를 넘는 경우 방향 반전
  if (newTopPercent <= 0 || newTopPercent >= 100 - ballHeightPercent) {
    ballDirectionY *= -1;
    newTopPercent = Math.max(
      0,
      Math.min(newTopPercent, 100 - ballHeightPercent)
    );
  }
  if (newLeftPercent <= 0 || newLeftPercent >= 100 - ballWidthPercent) {
    ballDirectionX *= -1;
    newLeftPercent = Math.max(
      0,
      Math.min(newLeftPercent, 100 - ballWidthPercent)
    );
  }

  // 위치 업데이트
  ball.style.top = newTopPercent + "%";
  ball.style.left = newLeftPercent + "%";

  // 다음 프레임 요청
  requestAnimationFrame(moveBall);
}

// 공의 초기 위치를 화면 중앙으로 설정
document.getElementById("ball").style.top = "50%";
document.getElementById("ball").style.left = "50%";

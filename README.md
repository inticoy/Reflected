<h1 align="center">
  Reflected
</h1>

<h3 align="center">
  소셜 로그인, JWT 인증, 실시간 채팅·알림 기능을 포함한 풀스택 토이 프로젝트
</h3>

## Introduction

**Reflected**는 소셜 로그인, 친구 추가, 채팅, 실시간 알림 기능을 갖춘 풀스택 웹 프로젝트입니다.
Django 백엔드, Vanilla JS + Bootstrap 프론트엔드를 사용하고, Docker Compose로 PostgreSQL, Django, Nginx를 컨테이너화하여 서비스 환경을 재현했습니다.

<img width="1490" alt="Screenshot 2025-03-16 at 18 25 39" src="https://github.com/user-attachments/assets/09aa674b-9cd5-4f99-9f96-fdb0783386ac" />

- [시연 영상](https://youtu.be/MAw9wcZ9duw)

## Key Features

- OAuth 2.0 + JWT
- 친구와 채팅
- Pong game play

## My Contribution

- **Design**: Figma를 활용한 UI 설계 (Figma Design Link)
- **Front-end**: Vanilla JS와 Bootstrap을 사용한 SPA 웹 애플리케이션 개발
- **Back-end**: Django와 PostgreSQL 기반의 RESTful API 서버 개발
- **Deployment**: Docker Compose를 이용한 전체 서비스 컨테이너 환경 구축

## Challenges and Solutions

### Back: 실시간 알림/채팅 구현을 위한 소켓 통신

**어려웠던 점**

소켓 통신만으로 알림/채팅 기능을 구현할 경우, 네트워크 불안정이나 일시적 연결 해제 시 데이터 누락이 발생할 수 있다는 점이 고민이었습니다. 특히 알림/채팅 데이터의 신뢰성을 유지하면서도 실시간성을 놓치지 않기 위해, 단순 소켓 기반으로 할지, REST API와 병행할지를 두고 많은 설계적 고민이 있었습니다.

**해결 방법**

- Django에서 Channels + Signals를 활용하여 새로운 알림이 생성될 때 웹소켓으로 실시간 전송했습니다.
- 프론트엔드에서는 웹소켓 연결을 유지하면서 새 알림 신호를 감지하고, 실제 데이터는 REST API (GET 요청) 를 통해 가져오는 혼합 방식으로 설계했습니다.
- 이를 통해 실시간성 + 데이터 누락 방지 두 가지 문제를 동시에 해결했습니다.

**관련 코드**
- [Django Chat Directory](./backend/django/reflected/chat/)

### Front: Vanilla JS 기반 구조적 설계와 인증 처리

**어려웠던 점**

프레임워크 없이(React, Vue 등) 순수 Vanilla JS로 개발하면서, API 호출, JWT 인증, 토큰 갱신(Refresh) 등 복잡한 기능을 어떻게 구조적으로 재사용 가능하게 분리할지에 대한 고민이 있었습니다. 특히, 로그인/로그아웃, 친구 추가, 채팅 등 다양한 기능에서 일관된 인증 흐름과 에러 처리를 유지해야 했습니다.

**해결 방법**

- API 요청 모듈(Api 클래스) 을 별도로 생성하여 JWT 토큰 기반 인증, 자동 갱신, 공통 에러 처리를 통합 관리했습니다.
- Api.request() 메서드 하나로 모든 GET/POST 요청을 통일해 재사용성을 높였고, 만료된 토큰을 자동으로 재발급하여 사용자 경험을 저하시키지 않도록 했습니다.
- Vanilla JS로 SPA를 구축하면서도 구조화된 코드 관리 방식을 확립했습니다.

**관련 코드**
- [API Source code](./frontend/src/utils/api.js)

# node.js_bookstore
Node.js를 활용한 서점 사이트

#### - server: node.js express 사용
#### - front: ejs 사용

#### - lib: js 파일 모음 (서버 기능)
#### - views: ejs 파일 모음 (화면 구성)
#### - public/images: 사용되는 파일 및 이미지 모음

******************************

[1. 메인 페이지](#메인-페이지)

[2. authentic](#로그인-/-로그아웃-/-회원가입-/-비밀번호-변경)

[3. book detail](#로그인-하기-전-/-로그인-후-책-세부-정보-화면)

[4. 구매 및 장바구니](#구매-및-장바구니)

[5. board](#게시판)

[6. util](#검색-기능)

[7. admin](#관리자-기능)

### 메인 페이지
![image](https://user-images.githubusercontent.com/116738827/224460584-6774c17b-e424-4362-a979-6837faade56a.png)

- Home: 메인 홈 화면
- Best: 베스트 셀러인 도서 확인 가능
- MonBook: 이달의 책 추천 기능
- ebook: ebook을 제공하는 도서 확인 가능

### 로그인 / 회원가입 / 로그아웃 / 비밀번호 변경
![image](https://user-images.githubusercontent.com/116738827/224460511-25df96f0-3cfb-4438-8698-c3de27bf09e5.png)

- cookie & session으로 관리

### 로그인 하기 전 / 로그인 후 책 세부 정보 화면
![image](https://user-images.githubusercontent.com/116738827/224456383-f675617b-46cd-4b51-89ab-3967f0dc63b2.png)

### 구매 및 장바구니
![image](https://user-images.githubusercontent.com/116738827/224460385-b8cce3a9-c98f-42ea-b45f-51a1025a7970.png)

- cart: 장바구니 기능. 개별 구매 / 일괄 구매 / 삭제 가능
- Order: 주문 내역. 취소 및 환불 가능

### 게시판
- 로그인 후 이용 가능
- 본인의 게시글만 수정, 삭제 가능
- admin(관리자) 로그인 시 모든 회원의 게시글에 접근 권한 있음

### 검색 기능
- 일반 회원일 경우 책 검색만 가능
- admin(관리자)일 경우 책 검색과 회원 검색 가능

### 관리자 기능
admin으로 로그인 시
- 회원 정보 열람이 가능하며 회원 등록, 회원 정보 변경, 회원 삭제가 가능
- 책 list를 볼 수 있으며 책 추가, 책 정보 변경, 삭제가 가

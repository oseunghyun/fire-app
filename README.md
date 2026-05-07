# FIRE

파이어족 가능성 분석 앱 프로토타입입니다. Expo Router 기반 React Native 앱으로, 가구별 FIRE 계산, 월간 트래킹, 크루 랭킹, AI 리포트 화면을 포함합니다.

## Run

```sh
npm install
npm run start
```

## Web Deploy

This project is ready for Vercel static deployment.

```sh
npm run build:web
```

Vercel settings:

- Build command: `npm run build:web`
- Output directory: `dist`
- Environment variables: `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY`

## Supabase

Supabase Auth와 DB 연결 준비가 포함되어 있습니다.

1. `.env.example`을 `.env`로 복사합니다.
2. Supabase URL과 anon key를 넣습니다.
3. `supabase/schema.sql`을 Supabase SQL editor에서 실행합니다.

자세한 내용은 [docs/supabase-setup.md](docs/supabase-setup.md)를 확인하세요.

## Privacy Model

서버에는 크루/랭킹용 공유 지표만 저장합니다.

- 저장 가능: 저축률, 달성률, FIRE까지 남은 개월, 목표 연도
- 로컬 보관: 실제 자산, 소득, 지출 상세

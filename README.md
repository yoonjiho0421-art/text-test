# 단어 테스트장

웹 링크 : https://yoonjiho0421-art.github.io/text-test/
웹 링크에서 다운로드 가능합니다

## 버전 관리

앱 버전은 Git 태그를 기준으로 관리합니다.

- `v1.1.21` 태그를 push하면 GitHub Actions가 앱 내부 버전, 하단 버전 표시, manifest 설명, Service Worker 캐시 버전을 `1.1.21`로 자동 동기화합니다.
- GitHub Actions의 **Version Sync → Run workflow**를 직접 실행할 수도 있습니다.
- 태그는 `v메이저.마이너.패치` 형식(예: `v1.1.21`)을 사용합니다.
- 소스에는 `__APP_VERSION__` 자리표시자를 사용하므로 버전 번호를 여러 파일에서 수동으로 바꿀 필요가 없습니다.

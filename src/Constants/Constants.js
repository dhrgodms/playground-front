const serverUrl = `${process.env.REACT_APP_SERVER_URL}:8080`;
const serverUrlV1 = `${process.env.REACT_APP_SERVER_URL}:8080/api`;
const serverUrlV2 = `${process.env.REACT_APP_SERVER_URL}:8080/api/v2`;

// 카테고리 상수 (Mock 데이터)
const categories = [
    { id: 1, name: "생각글", description: "생각과 고민을 나누는 글" },
    { id: 2, name: "만화글", description: "만화와 그림 관련 글" },
    { id: 3, name: "플레이리스트", description: "음악 플레이리스트" }
];

module.exports = { serverUrl, serverUrlV1, serverUrlV2, categories };
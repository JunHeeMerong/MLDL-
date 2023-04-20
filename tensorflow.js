// import * as tf from "/@tensorflow/tfjs";
const data = [
  {
    url: "스파크",
    name: "SPARK",
    price: "977~1,487만원",
    fuelEfficiency: "복합 14.4~15km/ℓ 도심 13.4~14.3, 고속 16~16.1",
    fuel: "가솔린",
  },
  {
    url: "gv60",
    name: "GV60",
    price: "6,493~7,413만원",
    fuelEfficiency: "복합 4.1~5.1km/kWh 도심 4.3~5.7, 고속 3.8~4.5",
    fuel: "전기",
  },
  {
    url: "아이오닉5",
    name: "IONIQ5",
    price: "5,005~6,135만원 ",
    fuelEfficiency: "복합 4.7~5.2km/kWh 도심 5.3~5.9, 고속 4.2~4.5",
    fuel: "전기",
  },
  {
    url: "k5",
    name: "K5",
    price: "2,400~3,284만원 ",
    fuelEfficiency: "복합 9.8~13.6km/ℓ 도심 8.7~12.1, 고속 11.4~16",
    fuel: "LPG, 가솔린",
  },
];

async function loadModel() {
  const model = await tf.loadGraphModel("./model2/model.json");
  return model;
}

// 이미지 로드 및 전처리
async function preprocessImage(image) {
  // 이미지 크기를 모델이 예상하는 크기로 조정
  const tensor = tf.browser
    .fromPixels(image)
    .resizeNearestNeighbor([300, 300])
    .toFloat();

  // 이미지를 모델이 예상하는 형식으로 정규화
  const offset = tf.scalar(255);
  const normalized = tensor.div(offset);
  const normalized2 = tf.expandDims(normalized, 0);
  // 모델이 예상하는 형식의 텐서로 변환하여 반환
  return normalized2;
}

// 이미지 분류
async function classifyImage(model, image) {
  // 이미지 전처리
  const tensor = await preprocessImage(image);
  console.log(tensor);
  const tensorData = tensor.dataSync();
  const tensor3D = tf.tensor4d(tensorData, [1, 300, 300, 3]);

  // 모델을 사용하여 예측 수행
  const predictions = await model.predict(tensor3D).data();

  // 예측 결과 반환
  return predictions;
}

const searchstart = document.getElementsByClassName("searchstart")[0];

const paintInfo = (index) => {
  const beforeContainer =
    document.getElementsByClassName("search_container")[0] || undefined;
  beforeContainer?.remove();

  const container = document.createElement("div");
  const img = document.createElement("img");
  const graphContainer = document.createElement("div");
  const box1 = document.createElement("div");
  const box2 = document.createElement("div");
  const box3 = document.createElement("div");
  const box4 = document.createElement("div");
  const box5 = document.createElement("div");
  const box6 = document.createElement("div");
  const name = document.createElement("h2");

  container.className = "search_container";
  img.className = "search_img";
  img.src = `./images/${data[index].url}.png`;
  graphContainer.className = "graph_container";
  box1.innerText = "가격";
  box3.innerText = "연비";
  box5.innerText = "연료";
  box2.innerText = data[index].price;
  box4.innerText = data[index].fuelEfficiency;
  box6.innerText = data[index].fuel;
  name.innerText = data[index].name;

  container.appendChild(name);
  graphContainer.appendChild(box1);
  graphContainer.appendChild(box2);
  graphContainer.appendChild(box3);
  graphContainer.appendChild(box4);
  graphContainer.appendChild(box5);
  graphContainer.appendChild(box6);
  container.appendChild(img);
  container.appendChild(graphContainer);
  searchstart.appendChild(container);

  setTimeout(() => {
    img.classList.add("active");
  }, 0);

  setTimeout(() => {
    graphContainer.classList.add("active");
  }, 1000);
  //   0 -> 0.004초 후 실행
};

// 이미지 업로드 및 분류 실행
const inputElement = document.getElementById("imageUpload");
inputElement.addEventListener("change", handleFiles);

async function handleFiles() {
  const file = this.files[0];

  // 이미지를 화면에 표시
  const img = document.createElement("img");
  img.src = URL.createObjectURL(file);
  img.style.position = "absolute";
  img.style.left = "10%";
  img.style.top = "50%";
  img.width = 300;
  img.height = 300;
  img.style.float = "left";
  document.body.appendChild(img);

  // 모델 로드
  const model = await loadModel();

  // 이미지 분류
  const predictions = await classifyImage(model, img);

  // 분류 결과 출력
  const index = predictions.indexOf(Math.max(...predictions));
  paintInfo(index);
}

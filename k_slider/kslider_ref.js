//  함수의 세분화

// 1. load 준비 
function kSlider(target, option) {
  const toBeLoaded = document.querySelectorAll(`${target} img`);

  if (toBeLoaded.length === 0) {
    throw new Error("Cant Found Document Element");
  }


  let loadedImages = 0;
  toBeLoaded.forEach((item) => {
    item.onload = () => {
      loadedImages += 1;
      if (loadedImages === toBeLoaded.length) {
        run(target, option);
      }
    }
  })
};

// innerName 함수대신에, 기능의 세분화 함수를 호출하는 run 함수를 만든다.
// 은닉화를 위한 Option을 함수의 변수를 만든다. 
// setNode, setSliding의 함수를 실행한다.
function run(target, option) {
  const OPTION = setOption(option);

  setNode(target);
  setSliding(target, OPTION);
}

// 2. 옵셔 준비 (에니메이션 스피드, 가로세로 옵션)
function setOption(option) {

  //항목 점검
  let OPTION = {
    speed: 1000,
    direction: 'horizontal'
  }

  // 옵션 세팅하기
  for (prop in option) {
    if (prop in OPTION) {
      // 값 점검
      exception(prop, option[prop]);
      OPTION[prop] = option[prop];
    } else {
      throw new Error(`사용할 수 없는 ${option[prop]}입니다.`);
    }
  }

  // option 값을 점검하는 함수를 정의한다.
  function exception(prop, value) {
    switch (prop) {
      case 'speed':
        if (value > 0)
          break;
      case 'direction':
        if (value === 'horizontal' || value === 'vertical')
          break;
      default:
        throw new Error(`잘못된 옵션 값이 있습니다.: ${prop}`);

    }
  }

  return Object.freeze(OPTION);

};



// 3. 노드 준비
function setNode(target) {
  const slider = document.querySelector(target); // 주인공찾고
  const kindWrap = document.createElement('div'); // 만들고
  const kindSlider = document.createElement('div'); // 만들고

  slider.classList.add('k_list');// 셋팅하고
  kindWrap.className = 'kind_wrap';// 셋팅하고
  kindSlider.className = 'kind_slider';// 셋팅하고
  slider.parentNode.insertBefore(kindWrap, slider); // 붙이고
  kindWrap.appendChild(kindSlider);// 붙이고
  kindSlider.appendChild(slider);// 붙이고
  const slideItems = slider.children;
  for (let i = 0; i < slideItems.length; i++) {
    slideItems[i].className = 'k_item';
  }
  const cloneA = slideItems[0].cloneNode(true);
  const cloneC = slideItems[slideItems.length - 1].cloneNode(true);
  slider.insertBefore(cloneC, slideItems[0]);
  slider.appendChild(cloneA);
  const moveButton = document.createElement('div');
  const prevA = document.createElement('a');
  const nextA = document.createElement('a');
  moveButton.className = 'arrow';
  prevA.className = 'prev';
  nextA.className = 'next';
  prevA.href = '';
  nextA.href = '';
  prevA.textContent = '이전';
  nextA.textContent = '다음';
  moveButton.appendChild(prevA);
  moveButton.appendChild(nextA);
  kindWrap.appendChild(moveButton);
};
// 4. 동작준비
function setSliding(target, OPTION) {
  // 변수 준비 
  let moveDist = 0;
  let currentNum = 1;

  // 클론 포함 세팅
  const slider = document.querySelector(target);
  const slideCloneItems = slider.querySelectorAll('.k_item');
  const moveButton = document.querySelector('.arrow');

  // 넓이를 세팅한다.
  const liWidth = slideCloneItems[0].clientWidth;
  const sliderWidth = liWidth * slideCloneItems.length;
  slider.style.width = `${sliderWidth}px`;


  /*처음 위치 잡기*/
  moveDist = -liWidth;
  slider.style.left = `${moveDist}px`;

  const POS = {
    // 같은이름으로 나열하고싶을때, 나열하면 된다.
    // moveDist: moveDist
    moveDist, liWidth, currentNum
  };

  //이벤트 리스터 걸기
  moveButton.addEventListener('click', e => {
    sliding(e, OPTION, target, POS);
  });
}



// 5. 동작
function sliding(ev, OPTION, target, POS) {
  ev.preventDefault();

  const slider = document.querySelector(target);
  const slideCloneItems = slider.querySelectorAll('.k_item');

  if (ev.target.className === 'next') {// 다음이 눌렸을때
    move(-1);
    if (POS.currentNum === slideCloneItems.length - 1) {// 마지막이면
      setTimeout(() => {
        slider.style.transition = 'none'; // 애니끄고
        POS.moveDist = -POS.liWidth; // 진짜A의 값으로 만들고
        slider.style.left = `${POS.moveDist}px`; //진짜A의 위치로 보내고
        POS.currentNum = 1; // 현재번호 업데이트
      }, OPTION.speed);
    }
  } else { // 이전이 눌렸을때
    move(1);
    if (currentNum === 0) {
      setTimeout(() => {
        slider.style.transition = 'none';
        POS.moveDist = -POS.liWidth * (slideCloneItems.length - 2);
        slider.style.left = `${POS.moveDist}px`;
        POS.currentNum = slideCloneItems.length - 2;
      }, OPTION.speed);
    }
  }
  function move(direction) { // 이동 <-   ->
    POS.currentNum += (-1 * direction);
    POS.moveDist += POS.liWidth * direction;
    slider.style.left = `${POS.moveDist}px`;
    slider.style.transition = `all ${OPTION.speed}ms ease`;
  }
}





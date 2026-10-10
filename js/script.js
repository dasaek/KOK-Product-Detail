
/* ---------------- 사이즈 + 실 색상 선택 시 총 금액 변화 ---------------- */
const sizeSelect = document.querySelector('#size');
const totalWon = document.querySelector('.won');

/* 베이스 / 포인트 색상을 골랐는지 기억 */
const selectedColors = {
    base: false,
    point: false
};

function updateTotalPrice() {

    const size = sizeSelect.value;

    /* 사이즈 + 베이스 + 포인트가 전부 선택됐는지 */
    if (
        size !== '' &&
        selectedColors.base === true &&
        selectedColors.point === true
    ) {

        if (size === 'M') {
            totalWon.textContent = '27,000원';
        }

        if (size === 'L') {
            totalWon.textContent = '30,000원';
        }

    } else {

        totalWon.textContent = '0원';

    }

    sizeSelect.addEventListener('change', function () {
        updateTotalPrice();
    });
}

/* ------------------ 실 색상 옵션 바 ------------------ */
const colorBtns = document.querySelectorAll('.color_btn');
const colorList = document.querySelector('.color_list');
const colorChips = document.querySelectorAll('.color_chip button');

/* 현재 베이스/포인트 중 무엇을 선택 중인지 */
let currentTarget = null;

colorBtns.forEach(function (btn) {

    btn.addEventListener('click', function () {

        const clickedTarget = this.closest('.color_select');

        /* 같은 버튼을 다시 눌렀다면 닫기 */
        if (
            currentTarget === clickedTarget &&
            colorList.classList.contains('active')
        ) {
            colorList.classList.remove('active');
            currentTarget = null;
            return;
        }

        /* 새로 누른 버튼을 현재 타깃으로 저장 */
        currentTarget = clickedTarget;

        /* 옵션바 열기 */
        colorList.classList.add('active');


        /* 기존 선택 테두리 초기화 */
        colorChips.forEach(function (chip) {
            chip.classList.remove('active');
        });

        /* 포인트면 옵션칩 35px */
        const type = currentTarget.dataset.type;

        if (type === 'point') {
            colorList.classList.add('point_mode');
        } else {
            colorList.classList.remove('point_mode');
        }

    });

});

/* 실 색상 클릭 */
colorChips.forEach(function (chip) {

    chip.addEventListener('click', function () {

        /* 베이스/포인트를 먼저 선택하지 않았다면 실행 X */
        if (currentTarget === null) {
            return;
        }

        /* 1. 모든 실 버튼의 선택 테두리 제거 */
        colorChips.forEach(function (chip) {
            chip.classList.remove('active');
        });

        /* 2. 지금 클릭한 실에 테두리 추가 */
        this.classList.add('active');

        /* 3. 클릭한 실의 이미지 가져오기 */
        const selectedImg = this.querySelector('img');

        /* 4. 베이스 또는 포인트 버튼 가져오기 */
        const targetBtn = currentTarget.querySelector('.color_btn');

        /* 지금 선택한 게 base인지 point인지 */
        const type = currentTarget.dataset.type;

        /* 해당 색상 선택 완료 */
        selectedColors[type] = true;

        /* 5. 기존 + 제거 */
        targetBtn.innerHTML = '';

        /* 6. 새로운 이미지 만들기 */
        const newImg = document.createElement('img');

        newImg.src = selectedImg.src;
        newImg.alt = selectedImg.alt;

        /* 7. 베이스/포인트 버튼 안에 이미지 넣기 */
        targetBtn.appendChild(newImg);

        updateTotalPrice();

    });

});

/* ---------------- 상세페이지 더보기 ---------------- */

const moreBtn = document.querySelector('.more');
const detailContent = document.querySelector('.detail_content');

const moreText = moreBtn.querySelector('span');
const moreArrow = moreBtn.querySelector('img');


moreBtn.addEventListener('click', function () {

    detailContent.classList.toggle('closed');


    /* 접힌 상태 */
    if (detailContent.classList.contains('closed')) {
    moreText.textContent = '더보기';
    moreArrow.style.transform = 'rotate(180deg)';
}

    /* 펼쳐진 상태 */
    else {

        moreText.textContent = '접기';
        moreArrow.style.transform = 'rotate(0deg)';

    }

});

/* ---------------- 이동바 현재 위치 표시 ---------------- */

const moveLinks = document.querySelectorAll('.move_bar a');

const moveSections = [
    document.querySelector('#diy_intro'),
    document.querySelector('#color_chart'),
    document.querySelector('#size_table'),
    document.querySelector('#review'),
    document.querySelector('#qna')
];

let isClickScrolling = false;


/* 메뉴 클릭 */
moveLinks.forEach(function (link) {

    link.addEventListener('click', function (e) {

        const targetId = this.getAttribute('href');
        const target = document.querySelector(targetId);

        if (!target) return;

        /* 상품정보, 색상, 사이즈를 클릭한 경우 */
        if (['#diy_intro', '#color_chart', '#size_table'].includes(targetId)) {

            /* 상세페이지가 접혀 있다면 펼치기 */
            if (detailContent.classList.contains('closed')) {
                detailContent.classList.remove('closed');

                moreText.textContent = '접기';
                moreArrow.style.transform = 'rotate(0deg)';
            }
        }

        /* 기존 앵커 이동 대신 직접 스크롤 */
        e.preventDefault();

        isClickScrolling = true;

        /* 주황선 즉시 변경 */
        moveLinks.forEach(function (link) {
            link.parentElement.classList.remove('active');
        });

        this.parentElement.classList.add('active');

        /* 펼쳐진 레이아웃 기준으로 스크롤 */
        target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });

    });

});


/* ===== 타이틀 주황선 길이 계산 ===== */
document.querySelectorAll(
    '.title_line1 path, .title_line2 path'
).forEach(function (path) {
    const length = path.getTotalLength();
    path.style.setProperty('--title-length', length + 'px');
});


/* ===== 타이틀이 처음 보일 때 애니메이션 시작 ===== */
const titleLineWrap = document.querySelector('.title_line_wrap');

const titleLineObserver = new IntersectionObserver(function (entries, observer) {
    entries.forEach(function (entry) {
        if (entry.isIntersecting) {
            titleLineWrap.classList.add('line-start');

            // 한 번 시작한 후에는 관찰 종료
            observer.unobserve(entry.target);
        }
    });
}, {
    threshold: 0
});

titleLineObserver.observe(document.querySelector('.title_line1'));

/* diy 선이 처음 보일 때 애니메이션 시작 */
const lineTarget = document.querySelector('.blue_line');
const detailPage = document.querySelector('#detail_page');

const lineObserver = new IntersectionObserver(function (entries, observer) {
    entries.forEach(function (entry) {

        if (entry.isIntersecting) {
            detailPage.classList.add('line-start');

            // 최초 1회 감지 후 관찰 종료
            observer.unobserve(entry.target);
        }

    });
}, {
    threshold: 0.1
});

lineObserver.observe(lineTarget);

/* ===== diy 라인 애니메이션 ===== */
const drawPaths = document.querySelectorAll(
    '.blue_line path, .orange_line1 path, .orange_line2 path'
);

drawPaths.forEach(function (path) {
    const length = path.getTotalLength();

    path.style.setProperty('--line-length', length + 'px');
});

/* ===== match 주황선 길이 계산 ===== */
const orangePath = document.querySelector('.orange_path .draw_path');

const pathLength = orangePath.getTotalLength();
orangePath.style.setProperty('--path-length', pathLength + 'px');


/* ===== 화면에 처음 나타나면 애니메이션 시작 ===== */
const matchPart = document.querySelector('#match_part');

const orangePathObserver = new IntersectionObserver(function (entries, observer) {
    entries.forEach(function (entry) {
        if (entry.isIntersecting) {
            matchPart.classList.add('line-start');
            observer.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1
});

orangePathObserver.observe(matchPart);

/* 리뷰 js 모음 */
$(function () {

    // 리뷰 종류 클릭 시.
    $('.review_sort li').click(function () {
        $('.review_sort li').removeClass('active');
        $(this).addClass('active');
    });

    // 리뷰 사이즈 클릭 시,
    $('.option_size button').click(function () {
        $(this).toggleClass('active');
        filterReviews();
    });

    /* 색상 옵션 클릭 시, */
    $('.palette button').click(function () {
        $(this).toggleClass('active');
        filterReviews();
    });
    /* 리뷰 내용 + 미니 썸네일 클릭 시 */
    $('.click_wrap').click(function () {
        $(this).closest('.review_user').toggleClass('open');
    });

    /* 상품 옵션 버튼 클릭 시 펼치기 / 접기 */
    $('.review_control button').click(function () {

        $(this).toggleClass('active');

        $('.review_product_option').toggleClass('active');

    });

    /* 리뷰 필터링 */
    function filterReviews() {

        // 선택한 색상 가져오기
        const colors = $('.palette button.active').map(function () {
            return $(this).data('color');
        }).get();

        // 선택한 사이즈 가져오기
        const size = $('.option_size button.active').text().trim();

        $('.review_user').each(function () {

            const reviewColors = $(this).data('color').split(' ');
            const reviewSize = $(this).data('size');

            // 선택한 색상 중 하나라도 포함되면 통과
            const colorMatch = colors.length === 0 ||
                colors.some(color => reviewColors.includes(color));

            // 사이즈가 일치하면 통과
            const sizeMatch = size === '' || reviewSize === size;

            // 두 조건 모두 만족하는 리뷰만 표시
            $(this).toggle(colorMatch && sizeMatch);
        });
    }

});

$(document).ready(function (event) {

    $('.navbar-icon-mobile').click(function () {
      $('.navbar-menu-icon-mobile').toggle();
      $('.navbar-close-icon-mobile').toggle();
      $('.navbar-menu-mobile').toggle();
      $('.banner, main').toggle(10);
    });
  
    $('.category-click').click(function () {
      $(this).find('.category-menu').slideToggle();
    });
    $(".filter-btn").click(function () {
      $(".active").removeClass("active");
      $(this).addClass("active");
    });
    $('.sort-new').click(function (event) {
      event.preventDefault();
      $('.sort-menu').slideDown();
      $('.sort-text').text('由新到舊');
    });
    $('.sort-old').click(function (event) {
      event.preventDefault();
      $('.sort-menu').slideDown();
      $('.sort-text').text('由舊到新');
    });
  
    $('.QnA-list').click(function (event) {
      event.preventDefault();
      $(this).toggleClass('QnA-list-active');
      $(this).find('.icon-add').toggleClass('d-none');
      $(this).find('.icon-remove').toggle();
      $(this).find('.QnA-detail-a').slideToggle();
    })
  });
  
 
  const enterpriseSwiper = new Swiper(".enterprise-swiper", {
    slidesPerView: 'auto',
    spaceBetween: 20,
    freeMode: true,
  });
  
  
  
  const commentSwipper = new Swiper('.comment-swiper', {
  
   
    slidesPerView: 1,
   
    slidesPerGroup: 1,
   
    spaceBetween: 0,
    loop: true,         
   
    autoplay: {
      delay: 2500,
    },
    // 斷點
    breakpoints: {
      767: {
        slidesPerView: 2,
        slidesPerGroup: 1,
        spaceBetween: 24,
        loop: false,
      },
      992: {
        slidesPerView: 3,
        slidesPerGroup: 0,
        spaceBetween: 24,
        loop: false,
      },
    },
    
    pagination: {
      el: '.swiper-pagination',
      clickable: true,        
    },
   
  });
  
  
  
 
  const apiPath = "https://2023-engineer-camp.zeabur.app";    
  const product = document.querySelector(".product");        
  const pagination = document.querySelector(".pagination");   
  
  const data = {
    type: "",
    sort: 0,
    page: 1,
    search: ""
  };
  
  let worksData = [];     // Line138
  let pagesData = {};     // Line165
  

  function getData({ type, sort, page, search }) {
    const apiUrl = `${apiPath}/api/v1/works?sort=${sort}&page=${page}&${
      type ? `type=${type}&` : ""
    }${search ? `search=${search}` : ""}`;
  
    
    axios.get(apiUrl).then(function (response) {
      worksData = response.data.ai_works.data;
      pagesData = response.data.ai_works.page;
  
     
  
      WorksRender();
      PagesRender();
    });
  }
  
  getData(data); 
  
  
  function WorksRender() {
    let works = "";
  
    worksData.forEach((item) => {
      works +=  `<li class="product-card">
          <div class="product-card-pic">
            <img class="img" src="${item.imageUrl}" alt="ai image">
          </div>
          <div class="product-subject">
            <h4 class="product-subject-title fz-20">${item.title}</h4>
            <p class="product-subject-describe">${item.description}</p>
          </div>
          <div class="product-belong">
            <p class="ai">AI 模型</p>
            <p class="name">${item.discordId.slice(0, -5)}</p>
          </div>
          <div class="product-function">
            <span class="tag">#${item.type}</span>
            <a class="card-link" href="${item.link}" target="_blank">
              <span class="material-icons">share</span>
            </a>
          </div>
      </li>`;
    });
  
    product.innerHTML = works;   
  }
  

  function changePage(pagesData) {
    const pageLinks = document.querySelectorAll("a.pagination-item-link");
    let pageId = "";
  
    pageLinks.forEach((item) => {
      item.addEventListener("click", (e) => {
        e.preventDefault();
        pageId = e.target.dataset.page;
        data.page = Number(pageId);
  
        if (!pageId) {
          data.page = Number(pagesData.current_page) + 1;
        }
  
        getData(data);
      });
    });
  }
  

  function PagesRender() {
    let pageStr = "";
  
    for (let i = 1; i <= pagesData.total_pages; i += 1) {
      pageStr +=  `<li class="pagination-item ${
        pagesData.current_page == i ? "active" : ""
      }" >
        <a class="pagination-item-link ${
          pagesData.current_page == i ? "disabled" : ""
        }" href="#search"  data-page="${i}">${i}</a>
      </li>`;
    }
  
    if (pagesData.has_next) {
      pageStr +=  `<li class="pagination-item">
        <a class="pagination-item-link" href="#search">
          <span class="material-icons">
            keyboard_arrow_right
          </span>
        </a>
      </li>`;
    }
    pagination.innerHTML = pageStr;
  
    changePage(pagesData);
  }
  

  const desc = document.querySelector("#desc");
  const asc = document.querySelector("#asc");

  desc.addEventListener("click", function (e) {
    e.preventDefault();
    data.sort = 0;
    getData(data);
  });

  asc.addEventListener("click", function (e) {
    e.preventDefault();
    data.sort = 1;
    getData(data);
  });
  

  const filterBtns = document.querySelectorAll(".filter-btn");
  filterBtns.forEach(function (item) {
    item.addEventListener("click", function () {
      if (item.textContent === "全部") {
        data.type = "";
      } else {

        data.type = item.textContent;
      }
      getData(data);
    });
  });
  

  const search = document.querySelector("#search");
  search.addEventListener("keydown", function (e) {
    if (e.keyCode === 13) {
      data.search = search.value;
      data.page = 1;
      getData(data);
     
    }
  });
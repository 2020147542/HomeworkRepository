fetch("product.json")
    .then(response => response.json())
    .then(json => loadItems(json))
    .catch(err => console.log(err));

function loadItems(json) {
    let button = document.querySelector('.button');
    let counter = 4;
    let showlist = [];
    let net = [];

    window.onscroll = () => {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
            console.log("여기가 끝이야 새로운걸 내보내란 말이야");
            load(net);
        }
    }
    net = json;
    fdisplay(net);

    button.onclick = filter;
    function filter(event) {
        event.preventDefault();

        showlist = [];
        net = [];
        let category = document.querySelector('#category').value;
        let keyword = document.querySelector('#keyword').value.toLowerCase();
        console.log("keyword is " + keyword);

        //category
        if (category == "all") {
            console.log("category is all");
            showlist = json;
        } else {
            for (let i = 0; i < json.length; i++) {
                console.log("category is " + category);
                if (json[i].category == category)
                    showlist.push(json[i]);
            }
        }

        //keyword
        if (keyword == "") {
            console.log("keyword1 is " + keyword);
            net = showlist;
        }
        else {
            for (let i = 0; i < showlist.length; i++) {
                console.log("keyword2 is " + keyword);
                let name = showlist[i].name.toLowerCase();
                console.log("name_low is " + name);
                if (name.search(keyword) != -1)
                    net.push(showlist[i]);
            }
        }
        fdisplay(net);
    }

    function load(list) {
        const start = counter;
        const end = start + 3;

        if (end < list.length) {
            console.log("end : " + end);
            counter = end + 1;
            for (let i = start; i <= end; i++) {
                console.log('append' + list[i]);
                addElement(list[i]);
            }
        }
        else if (start < list.length) {
            console.log("start : " + start);
            counter = list.length;
            console.log("length: " + counter);

            for (let i = start; i < counter; i++) {
                console.log('append' + list[i]);
                addElement(list[i]);
            }
        }
        else {
            console.log("return : " + start);
            return
        }
    }
}

function fdisplay(list) {
    let length = list.length;

    while (figure.firstChild) {
        console.log('removeChild 전 ' + figure.firstChild);
        figure.removeChild(figure.firstChild);
        console.log('removeChild 후 ' + figure.firstChild);
    }
    if (length > 4) length = 4;
    for (let i = 0; i < length; i++) {
        console.log('append' + list[i]);
        addElement(list[i]);
    }
};

function addElement(item) {
    console.log('item :' + item);
    const div = document.createElement("div");
    const img = document.createElement("img");
    const name = document.createElement("p");
    const price = document.createElement("p");

    div.setAttribute('class', item.category);
    div.addEventListener('click', myclick, false);
    img.setAttribute('id', 'img');
    price.setAttribute('id', 'price');

    img.src = item.img;
    img.alt = item.name + "사진입니다.";
    name.textContent = "이 메뉴는 " + item.name;
    price.textContent = item.price + "원";
    name.style.display = 'none';
    price.style.display = 'none';

    figure.appendChild(div);
    div.appendChild(img);
    div.appendChild(name);
    div.appendChild(price);
};

function myclick(event) {
    var item = event.target;
    if (item.id == "img") {
        let name = item.nextSibling;
        let price = name.nextSibling;
        name.style.display = 'block';
        price.style.display = 'block';

    } else {
        var child = item.childNodes;
        child[1].style.display = 'block';
        child[2].style.display = 'block';
    }
}
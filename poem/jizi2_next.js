
function hiddenEle() {
    document.addEventListener('DOMContentLoaded', function () {
        var footerMetaElement = document.querySelector('.post-footer__meta');
        if (footerMetaElement) {
            var lastChild = footerMetaElement.lastElementChild;
            if (lastChild) {
                lastChild.style.marginBottom = '0';
                lastChild.style.display = 'none';
            } else {
                console.error('No child elements found in .post-footer__meta');
            }
        } else {
            console.error('Element with class .post-footer__meta not found');
        }

        // 隐藏 .post-entry__meta 元素
        var postEntryMetaElements = document.querySelectorAll('.post-entry__meta');
        postEntryMetaElements.forEach(function (element) {
            element.style.display = 'none';
        });

        // 隐藏 .post-title__meta 元素
        var postTitleMetaElements = document.querySelectorAll('.post-title__meta');
        postTitleMetaElements.forEach(function (element) {
            element.style.display = 'none';
        });
        var footerElement = document.querySelector('.footer');
        if (footerElement) {
            var lastChild = footerElement.lastElementChild;
            if (lastChild) {
                lastChild.style.marginBottom = '0';
                lastChild.style.display = 'none';
            } else {
                console.error('No child elements found in .post-footer__meta');
            }
        } else {
            console.error('Element with class .post-footer__meta not found');
        }
    });
}
function setupUI() {
    hiddenEle()
    mi_setupUI()
    color_setupUI()
    setting_setupUI()
    change_setupUI()
    defaultUI()
}
function defaultUI() {
    var elements = document.querySelector('.post-title__text');
    elements.textContent = '集字'
    var img = document.getElementById('backButton');
    img.addEventListener('click', function () {
        window.history.back()
    });
}
function initData(num) {

    var currentPage = 1;
    var pageSize = 10;
    number = num
    const inputText = localStorage.getItem('jiziInputContent');
    const cleanedText = retainChineseEnglishAndNumbers(inputText)
    const characters = cleanedText.split(''); // 分割成单个字符数组
    requestKey(handleData2)
    function retainChineseEnglishAndNumbers(text) {
        const regex = /[^\u4e00-\u9fa5a-zA-Z0-9]/g;
        return text.replace(regex, '');
    }
    function handleData2(data) {
        data.forEach(function (object) {
            key = object.get('name')
            requestZidianDict2(currentPage, pageSize, characters, handleData)
        })
    }
    function handleData(dataArr) {
        dataArray = dataArr
        var loading = document.querySelector('.loading');
        loading.style.display = 'none';
        renderImages(dataArr, num)
    }
    function renderImages(dataArr, n) {
        const imageContainer = document.getElementById('imageContainer');
        const container = document.getElementById('container');

        const imageSize = 50; // 图片宽高
        let currentRow = 0
        const lie = Math.ceil(dataArr.length / num);
        imageContainer.style.height = n * imageSize + 'px';
        imageContainer.style.width = lie * imageSize + 'px';

        container.style.height = n * imageSize + 50 + 'px';
        container.style.width = lie * imageSize + 50 + 'px';
        for (let i = 0; i < dataArr.length; i++) {
            const imgBg = document.createElement('div');
            imgBg.classList.add("imgBg");
            const lie = Math.floor(i / num);
            if (currentRow > num - 1) {
                currentRow = 0
            }
            imgBg.style.top = `${currentRow * 50}px`;
            imgBg.style.right = `${lie * 50}px`;
            currentRow++
            imageContainer.appendChild(imgBg);

            const img = document.createElement('img');
            let ob = dataArr[i];
            // 

            setImgData(img, ob)
            
            img.style.position = 'absolute';
            img.title = ob.get('name');
            imgBg.appendChild(img);

            const mi = document.createElement('img');
            mi.classList.add("mizige");
            mi.id = 'mizige'
            mi.style.display = 'none';
            mi.src = 'images/mc1.png';
            imgBg.appendChild(mi)

            // 添加双击事件监听器
            img.addEventListener('click', function () {
                // alert('图片被双击了！');
                
            });

            var longPressTimer;

            // 长按事件处理函数
            function handleLongPress() {
                currentImg = img
                currentImgIndex = i
                console.log(currentImg)
                console.log(currentImgIndex)
                // alert('图片被长按了！');
                // 在这里添加你想要执行的操作
                // window.location.href = 'shufaDict.html';
                change_openModal();
                requestZidianDict3(1, 50, img.title, requestData)
            }
    
            // 处理鼠标按下事件
            img.addEventListener('mousedown', function() {
                longPressTimer = setTimeout(handleLongPress, 500); // 500毫秒后触发长按事件
            });
    
            // 处理鼠标擡起事件
            img.addEventListener('mouseup', function() {
                clearTimeout(longPressTimer); // 清除定时器
            });
    
            // 处理鼠标离开事件
            img.addEventListener('mouseleave', function() {
                clearTimeout(longPressTimer); // 清除定时器
            });
    
            // 处理触摸事件（移动设备）
            img.addEventListener('touchstart', function() {
                longPressTimer = setTimeout(handleLongPress, 500); // 500毫秒后触发长按事件
            });
    
            img.addEventListener('touchend', function() {
                clearTimeout(longPressTimer); // 清除定时器
            });
    
            img.addEventListener('touchcancel', function() {
                clearTimeout(longPressTimer); // 清除定时器
            });
        }
    }
}
function requestData(results) {

    var container = document.getElementById("container2");
    container.innerHTML = '';
    results.forEach(function (object) {
        var newDiv = document.createElement("div");
        newDiv.classList.add("card");
        container.appendChild(newDiv);
        var newImg = document.createElement("img");
        setImgData(newImg, object);
        newDiv.appendChild(newImg);
        newImg.addEventListener('click', function () {

            setImgData(currentImg, object);
            dataArray[currentImgIndex] = object;
        });
    })
}
function savaPic() {
    html2canvas(document.getElementById('container'), {
        useCORS: true,
        allowTaint: false
    }).then(function (canvas) {
        // 将截图保存为图片
        var link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = 'screenshot.png';
        link.click();
    });
}

function setImgData(img,ob) {
    const imgurl = ob.get('img');
    if (imgurl == undefined) {
        let str = 'https://image.lintiebao.cn/shufa/dic/' + ob.get('title') + '.jpg'
        var decodedUrl = decodeURIComponent('https://proxyimage.lintiebao.cn/proxy?url=' + str);
        img.src = decodedUrl;
    } else {
        const encrypt = new JSEncrypt();
        encrypt.setPrivateKey(key);
        const decryptedData = encrypt.decrypt(imgurl);
        var decodedUrl = decodeURIComponent('https://proxyimage.lintiebao.cn/proxy?url=' + decryptedData);
        img.src = decodedUrl;
    }
}
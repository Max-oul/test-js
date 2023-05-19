async function getData(){
    const response = await fetch('https://jsonplaceholder.typicode.com/comments');
    const data = await response.json();
    let sortedData = data.sort((a,b) => a.postId - b.postId || a.id -b.id);
    return sortedData;
}
getData().then(sortedData => {
    let tbody = document.querySelector('tbody');
    let currentPage = 1;
    let itemsPerPage = 20;
    let totalPages = Math.ceil(sortedData.length / itemsPerPage);

    function showPage(page,data){
        tbody.innerHTML = '';
        let startIndex = (page - 1) * itemsPerPage;
        let endIndex = Math.min(startIndex + itemsPerPage, sortedData.length);
        for(let i = startIndex; i< endIndex; i++){
            let item = data[i];
            let tr = document.createElement('tr');
            Object.values(item).forEach(value => {
                let td = document.createElement('td');
                td.textContent = value;
                tr.appendChild(td);
            });
            tbody.appendChild(tr);
        }
    }
    //show first page
    showPage(currentPage,sortedData);
    //event handling for pagination button
    document.querySelector('.previous').addEventListener('click',()=>{
        if(currentPage > 1){
            currentPage--;
            showPage(currentPage,sortedData);
        }
    });
    document.querySelector('.next').addEventListener('click',()=>{
        if(currentPage < totalPages){
            currentPage++;
            showPage(currentPage,sortedData);
        }
    });

    let postIds = Array.from(new Set(sortedData.map(item => item.postId)));
    let menu= document.querySelector('.dropdown-menu');
    for(let i=0; i<postIds.length; i++){
        let li= document.createElement('li');
        let link = document.createElement('a');
        link.setAttribute('class','dropdown-item');
        link.textContent = postIds[i];
        menu.appendChild(li);
        li.appendChild(link);
        link.addEventListener('click',() => {
            let filteredData = sortedData.filter(item => item.postId === postIds[i]);
            let currentPage = 1;
            let itemsPerPage = 20;
            let totalPages = Math.ceil(filteredData.length / itemsPerPage);
            let view = document.querySelector('#dropdownMenuButton1');
            view.textContent = postIds[i];
            showPage(currentPage,filteredData);
            document.querySelector('.previous').addEventListener('click',()=>{
                if(currentPage > 1){
                    currentPage--;
                    showPage(currentPage,sortedData);
                }
            });
            document.querySelector('.next').addEventListener('click',()=>{
                if(currentPage < totalPages){
                    currentPage++;
                    showPage(currentPage,sortedData);
                }
            });
        });
    }
}).catch(error => {
    console.log(error);
})

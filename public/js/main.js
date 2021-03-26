function searchLogs(elem) {
    let filter, ul, li, a, b, i;
    filter = elem.innerText.toUpperCase() || elem.value.toUpperCase();
    ul = document.getElementById("logsContainer");
    li = ul.getElementsByTagName('p');

    for (i = 0; i < li.length; i++) {
        a = li[i].getElementsByTagName("span")[0];
        b = li[i].getElementsByTagName("span")[1];
        filterElements(a, b, li[i], filter);
    }
}

function filterElements(a, b, s, f) {
    let txtValueA, txtValueB;
    txtValueA = a.textContent || a.innerText;
    txtValueB = b.textContent || b.innerText;
    if (txtValueA.toUpperCase().indexOf(f) > -1 || txtValueB.toUpperCase().indexOf(f) > -1) {
        s.style.display = "";
    } else {
        s.style.display = "none";
    }
}

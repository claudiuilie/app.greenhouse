
function searchLogs(elem) {
    let filter, ul, li, a, b, i,s;
    filter = elem.innerText.toUpperCase() || elem.value.toUpperCase();
    s = document.getElementById("searchLogsInput");
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

function sendLogToModal(log) {
    let modalContent = document.getElementById("logInfoModalContent");
    let content = JSON.parse(log.innerText);
    modalContent.innerText = JSON.stringify(content,null,2);
}


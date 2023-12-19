
window.addEventListener("DOMContentLoaded", async ()=> {
    const rmvBtns = document.getElementsByClassName("remove");
    for(btn of rmvBtns){
        btn.addEventListener("click", remove);
    }
});

async function remove(event){
    const id = event.target.id;
    console.log(id);
    const type = id.split('-')[0];
    const num = id.split('-')[1];

    const card = document.getElementById(`${id}-card`);
    card.remove();
    const remove = {
        remove_from: type,
        entry_id: num
    }
    const request = fetch("/saved", {
        method: "POST",
        headers: {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify(remove)
    });
}
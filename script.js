document.querySelectorAll("button").forEach(btn=>{
    btn.addEventListener("mouseenter",()=>{
        btn.style.transform="translateY(-2px)";
    });

    btn.addEventListener("mouseleave",()=>{
        btn.style.transform="translateY(0)";
    });
});
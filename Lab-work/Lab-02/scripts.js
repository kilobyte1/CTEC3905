function greetMe() {
    console.log("Hello!!");
  }

  let myTrigger = document.getElementById("myTrigger");

  let clickCount = 0;

function incrementClickCount() {
  clickCount++;
	target.textContent = clickCount;
}

myTrigger.addEventListener('click', incrementClickCount);
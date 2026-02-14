const fetchShortenedURL = async () => {
  const response = await fetch("/links");
  const links = await response.json();
  console.log("links", links);

  const list = document.getElementById("shortened-urls");
  list.innerHTML = "";

  // Convert to array and sort by timestamp (newest first)
  const entries = Object.entries(links).sort((a, b) => {
    // Handle both old format (string) and new format (object with timestamp)
    const timeA = typeof a[1] === "object" ? a[1].timestamp : 0;
    const timeB = typeof b[1] === "object" ? b[1].timestamp : 0;
    return timeB - timeA; // Descending order (newest first)
  });

  for (const [shortCode, data] of entries) {
    const li = document.createElement("li");
    // Handle both old format (string) and new format (object)
    const url = typeof data === "string" ? data : data.url;
    const truncatedURL = url.length >= 20 ? `${url.slice(0, 20)}...` : url;
    li.innerHTML = `<a href="/${shortCode}" target="_blank">${window.location.origin}/${shortCode}</a> - ${truncatedURL}`;
    list.appendChild(li);
  }
};

document.addEventListener("DOMContentLoaded", () => {
  fetchShortenedURL();
});

document
  .getElementById("shorten-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const url = formData.get("url");
    //NOTE: Whatever is in the name attribute of the html file in form ...that should be passed in .get()
    const shortcode = formData.get("shortCode");
    console.log(url, shortcode);

    //NOTE: This below code is connecting frontend to backend
    //We are calling api --> /shorten
    try {
      const response = await fetch("/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, shortcode }),
      });

      if (response.ok) {
        alert("Form submitted successfully");

        event.target.reset(); //NOTE: This will clear the textbar after clicking shorten
        fetchShortenedURL();
      } else {
        const errormessage = await response.text();
        alert(errormessage);
      }
    } catch (error) {
      console.log(error);
      alert("Error: " + error.message);
    }
  });
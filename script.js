/**
 * Load and display starred repositories from events.json
 */

async function loadStarredRepositories() {
  const list = document.querySelector("#starred");
  const errorContainer = document.querySelector("#starred-error");

  // Validate that required elements exist
  if (!list) {
    console.error("Element #starred not found in DOM");
    return;
  }

  try {
    // Set loading state for accessibility
    list.setAttribute("aria-busy", "true");
    list.setAttribute("aria-label", "Loading starred repositories...");

    // Fetch the data with validation
    const response = await fetch("events.json");

    if (!response.ok) {
      throw new Error(
        `Failed to fetch starred repositories: ${response.status} ${response.statusText}`
      );
    }

    const events = await response.json();

    // Validate that events is an array
    if (!Array.isArray(events)) {
      throw new Error("Invalid data format: expected an array of repositories");
    }

    // Clear loading state
    list.innerHTML = "";
    list.setAttribute("aria-busy", "false");
    list.setAttribute("aria-label", "Starred repositories");

    // Handle empty list
    if (events.length === 0) {
      const emptyItem = document.createElement("li");
      emptyItem.className = "empty-state";
      emptyItem.textContent = "No starred repositories yet.";
      list.appendChild(emptyItem);
      return;
    }

    // Render each repository as a list item
    events.forEach((event, index) => {
      try {
        // Validate required fields
        if (!event.name || !event.starred) {
          console.warn(`Skipping invalid repository entry at index ${index}:`, event);
          return;
        }

        const item = document.createElement("li");
        item.textContent = `${event.name} — starred ${event.starred}`;
        list.appendChild(item);
      } catch (itemError) {
        console.error(`Error processing repository at index ${index}:`, itemError);
      }
    });

    // Clear any previous errors
    if (errorContainer) {
      errorContainer.innerHTML = "";
      errorContainer.setAttribute("aria-live", "off");
    }
  } catch (error) {
    console.error("Error loading starred repositories:", error);

    // Update loading state
    list.setAttribute("aria-busy", "false");
    list.innerHTML = "";

    // Display user-friendly error message
    const errorMessage = document.createElement("li");
    errorMessage.className = "error-state";
    errorMessage.textContent =
      "Unable to load starred repositories. Please check your connection and try again.";
    list.appendChild(errorMessage);

    // Also announce error to screen readers if error container exists
    if (errorContainer) {
      errorContainer.setAttribute("aria-live", "polite");
      errorContainer.setAttribute("role", "alert");
      errorContainer.textContent = error.message;
    }
  }
}

// Load repositories when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", loadStarredRepositories);
} else {
  // DOM is already loaded (e.g., script loaded after DOMContentLoaded)
  loadStarredRepositories();
}

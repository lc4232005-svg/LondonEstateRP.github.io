// Admin Authentication
const ADMIN_CODE = "0872";
const ADMIN_ACCESS_FLAG = "admin_access_flag";
let currentPin = "";

// Check if user is authenticated
function isAdminAuthenticated() {
    return sessionStorage.getItem(ADMIN_ACCESS_FLAG) === "true";
}

// Open admin modal
function openAdminModal() {
    currentPin = "";
    updatePinDisplay();
    document.getElementById("adminModal").style.display = "block";
    document.getElementById("errorMessage").textContent = "";
}

// Close admin modal
function closeAdminModal() {
    document.getElementById("adminModal").style.display = "none";
    currentPin = "";
    updatePinDisplay();
    document.getElementById("errorMessage").textContent = "";
}

// Enter PIN digit
function enterPin(digit) {
    if (currentPin.length < 4) {
        currentPin += digit;
        updatePinDisplay();
        
        // Auto-submit when 4 digits entered
        if (currentPin.length === 4) {
            setTimeout(submitPin, 300);
        }
    }
}

// Clear PIN
function clearPin() {
    currentPin = "";
    updatePinDisplay();
    document.getElementById("errorMessage").textContent = "";
}

// Update PIN display
function updatePinDisplay() {
    const dots = document.querySelectorAll(".pin-dot");
    dots.forEach((dot, index) => {
        if (index < currentPin.length) {
            dot.classList.add("filled");
        } else {
            dot.classList.remove("filled");
        }
    });
}

// Submit PIN
function submitPin() {
    if (currentPin === ADMIN_CODE) {
        // Set temporary access flag
        sessionStorage.setItem(ADMIN_ACCESS_FLAG, "true");
        closeAdminModal();
        window.location.href = "admin.html";
    } else {
        currentPin = "";
        updatePinDisplay();
        document.getElementById("errorMessage").textContent = "Invalid PIN. Please try again.";
        
        // Shake animation for error
        const modal = document.querySelector(".pin-modal");
        modal.style.animation = "none";
        setTimeout(() => {
            modal.style.animation = "shake 0.5s ease";
        }, 10);
    }
}

// Logout admin
function logoutAdmin() {
    sessionStorage.removeItem(ADMIN_ACCESS_FLAG);
    window.location.href = "index.html";
}

// Check authentication on admin page load - always require PIN
if (window.location.pathname.includes("admin.html")) {
    if (!isAdminAuthenticated()) {
        // Redirect to index to require PIN entry
        window.location.href = "index.html";
    } else {
        // Clear the flag immediately so PIN must be entered again on next visit
        sessionStorage.removeItem(ADMIN_ACCESS_FLAG);
    }
}

// Tab switching
function switchTab(tabName) {
    // Hide all tabs
    document.querySelectorAll(".tab-content").forEach(tab => {
        tab.classList.remove("active");
    });
    
    // Remove active class from all buttons
    document.querySelectorAll(".tab-btn").forEach(btn => {
        btn.classList.remove("active");
    });
    
    // Show selected tab
    document.getElementById(tabName + "Tab").classList.add("active");
    
    // Add active class to clicked button
    event.target.classList.add("active");
}

// Initialize data in localStorage
function initializeData() {
    if (!localStorage.getItem("staffData")) {
        const defaultStaff = [
            { id: 1, name: "JM", role: "Owner", image: "" },
            { id: 2, name: "Head Admin", role: "Head Administrator", image: "" },
            { id: 3, name: "Senior Admin", role: "Senior Administrator", image: "" },
            { id: 4, name: "Admin", role: "Administrator", image: "" },
            { id: 5, name: "Moderator", role: "Moderator", image: "" },
            { id: 6, name: "Support Team", role: "Support", image: "" }
        ];
        localStorage.setItem("staffData", JSON.stringify(defaultStaff));
    }
    
    if (!localStorage.getItem("rulesData")) {
        const defaultRules = [
            { id: 1, title: "FiveM Terms of Service", content: "All players must adhere to the official FiveM Terms of Service and Community Guidelines. Any violation of FiveM's TOS will result in immediate action." },
            { id: 2, title: "No Cheating or Exploiting", content: "The use of cheats, hacks, mods, or any third-party software that provides an unfair advantage is strictly prohibited. Exploiting bugs or glitches is also forbidden." },
            { id: 3, title: "VDM (Vehicle Deathmatch)", content: "Using your vehicle as a weapon to kill or injure players without valid roleplay reason is prohibited." },
            { id: 4, title: "RDM (Random Deathmatch)", content: "Killing or attacking other players without valid roleplay reason or proper initiation is strictly forbidden." },
            { id: 5, title: "Metagaming", content: "Using out-of-character (OOC) information for in-character (IC) advantage is not allowed." }
        ];
        localStorage.setItem("rulesData", JSON.stringify(defaultRules));
    }
}

// Load staff data
function loadStaffData() {
    const staffData = JSON.parse(localStorage.getItem("staffData")) || [];
    const staffList = document.getElementById("staffList");
    staffList.innerHTML = "";
    
    // Update stats
    document.getElementById("staffCount").textContent = staffData.length;
    
    staffData.forEach((staff, index) => {
        const staffItem = document.createElement("div");
        staffItem.className = "staff-item";
        staffItem.setAttribute("draggable", "true");
        staffItem.setAttribute("data-index", index);
        staffItem.innerHTML = `
            <div class="drag-handle">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11 18c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm-2-8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 4c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                </svg>
            </div>
            <div class="image-upload">
                <label>Profile Image:</label>
                <input type="file" accept="image/*" onchange="uploadStaffImage(${index}, this)">
                ${staff.image ? `<img src="${staff.image}" style="width: 50px; height: 50px; border-radius: 50%; object-fit: cover; margin-top: 5px;">` : ""}
            </div>
            <input type="text" value="${staff.name}" placeholder="Name" onchange="updateStaffName(${index}, this.value)">
            <input type="text" value="${staff.role}" placeholder="Role" onchange="updateStaffRole(${index}, this.value)">
            <button class="delete-btn" onclick="deleteStaffMember(${index})">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                </svg>
                Delete
            </button>
        `;
        
        // Add drag and drop event listeners
        staffItem.addEventListener('dragstart', handleDragStart);
        staffItem.addEventListener('dragend', handleDragEnd);
        staffItem.addEventListener('dragover', handleDragOver);
        staffItem.addEventListener('drop', handleDrop);
        staffItem.addEventListener('dragenter', handleDragEnter);
        staffItem.addEventListener('dragleave', handleDragLeave);
        
        staffList.appendChild(staffItem);
    });
}

let draggedItem = null;

function handleDragStart(e) {
    draggedItem = this;
    this.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
}

function handleDragEnd(e) {
    this.classList.remove('dragging');
    document.querySelectorAll('.staff-item').forEach(item => {
        item.classList.remove('drag-over');
    });
}

function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
}

function handleDragEnter(e) {
    this.classList.add('drag-over');
}

function handleDragLeave(e) {
    this.classList.remove('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    this.classList.remove('drag-over');
    
    if (draggedItem !== this) {
        const staffData = JSON.parse(localStorage.getItem("staffData")) || [];
        const fromIndex = parseInt(draggedItem.getAttribute('data-index'));
        const toIndex = parseInt(this.getAttribute('data-index'));
        
        // Reorder array
        const [movedItem] = staffData.splice(fromIndex, 1);
        staffData.splice(toIndex, 0, movedItem);
        
        // Save to localStorage
        localStorage.setItem("staffData", JSON.stringify(staffData));
        
        // Reload staff list
        loadStaffData();
    }
}

// Add staff member
function addStaffMember() {
    const staffData = JSON.parse(localStorage.getItem("staffData")) || [];
    const newId = staffData.length > 0 ? Math.max(...staffData.map(s => s.id)) + 1 : 1;
    staffData.push({ id: newId, name: "New Staff", role: "Role", image: "" });
    localStorage.setItem("staffData", JSON.stringify(staffData));
    loadStaffData();
}

// Delete staff member
function deleteStaffMember(index) {
    if (confirm("Are you sure you want to delete this staff member?")) {
        const staffData = JSON.parse(localStorage.getItem("staffData")) || [];
        staffData.splice(index, 1);
        localStorage.setItem("staffData", JSON.stringify(staffData));
        loadStaffData();
    }
}

// Update staff name
function updateStaffName(index, value) {
    const staffData = JSON.parse(localStorage.getItem("staffData")) || [];
    staffData[index].name = value;
    localStorage.setItem("staffData", JSON.stringify(staffData));
}

// Update staff role
function updateStaffRole(index, value) {
    const staffData = JSON.parse(localStorage.getItem("staffData")) || [];
    staffData[index].role = value;
    localStorage.setItem("staffData", JSON.stringify(staffData));
}

// Upload staff image
function uploadStaffImage(index, input) {
    const file = input.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const staffData = JSON.parse(localStorage.getItem("staffData")) || [];
            staffData[index].image = e.target.result;
            localStorage.setItem("staffData", JSON.stringify(staffData));
            loadStaffData();
        };
        reader.readAsDataURL(file);
    }
}

// Load rules data
function loadRulesData() {
    const rulesData = JSON.parse(localStorage.getItem("rulesData")) || [];
    const rulesList = document.getElementById("rulesList");
    rulesList.innerHTML = "";
    
    // Update stats
    document.getElementById("rulesCount").textContent = rulesData.length;
    
    rulesData.forEach((rule, index) => {
        const ruleItem = document.createElement("div");
        ruleItem.className = "rule-item-edit";
        ruleItem.innerHTML = `
            <input type="text" value="${rule.title}" placeholder="Rule Title" onchange="updateRuleTitle(${index}, this.value)">
            <textarea placeholder="Rule Content" onchange="updateRuleContent(${index}, this.value)">${rule.content}</textarea>
            <button class="delete-btn" onclick="deleteRule(${index})">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                </svg>
                Delete
            </button>
        `;
        rulesList.appendChild(ruleItem);
    });
}

// Add rule
function addRule() {
    const rulesData = JSON.parse(localStorage.getItem("rulesData")) || [];
    const newId = rulesData.length > 0 ? Math.max(...rulesData.map(r => r.id)) + 1 : 1;
    rulesData.push({ id: newId, title: "New Rule", content: "Rule description here..." });
    localStorage.setItem("rulesData", JSON.stringify(rulesData));
    loadRulesData();
}

// Delete rule
function deleteRule(index) {
    if (confirm("Are you sure you want to delete this rule?")) {
        const rulesData = JSON.parse(localStorage.getItem("rulesData")) || [];
        rulesData.splice(index, 1);
        localStorage.setItem("rulesData", JSON.stringify(rulesData));
        loadRulesData();
    }
}

// Update rule title
function updateRuleTitle(index, value) {
    const rulesData = JSON.parse(localStorage.getItem("rulesData")) || [];
    rulesData[index].title = value;
    localStorage.setItem("rulesData", JSON.stringify(rulesData));
}

// Update rule content
function updateRuleContent(index, value) {
    const rulesData = JSON.parse(localStorage.getItem("rulesData")) || [];
    rulesData[index].content = value;
    localStorage.setItem("rulesData", JSON.stringify(rulesData));
}

// Save rules (triggered by save button)
function saveRules() {
    alert("Rules saved successfully!");
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", function() {
    if (window.location.pathname.includes("admin.html")) {
        initializeData();
        loadStaffData();
        loadRulesData();
    } else if (window.location.pathname.includes("staff.html")) {
        loadStaffDisplay();
    }
});

// Load staff display on staff.html page
function loadStaffDisplay() {
    // Initialize default data if not exists
    if (!localStorage.getItem("staffData")) {
        const defaultStaff = [
            { id: 1, name: "JM", role: "Owner", image: "" },
            { id: 2, name: "Head Admin", role: "Head Administrator", image: "" },
            { id: 3, name: "Senior Admin", role: "Senior Administrator", image: "" },
            { id: 4, name: "Admin", role: "Administrator", image: "" },
            { id: 5, name: "Moderator", role: "Moderator", image: "" },
            { id: 6, name: "Support Team", role: "Support", image: "" }
        ];
        localStorage.setItem("staffData", JSON.stringify(defaultStaff));
    }
    
    const staffData = JSON.parse(localStorage.getItem("staffData")) || [];
    const staffGrid = document.getElementById("staffGrid");
    staffGrid.innerHTML = "";
    
    staffData.forEach(staff => {
        const staffCard = document.createElement("div");
        staffCard.className = "staff-card";
        
        if (staff.image) {
            staffCard.innerHTML = `
                <div class="staff-avatar">
                    <img src="${staff.image}" style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover;">
                </div>
                <h3>${staff.name}</h3>
                <p class="staff-role">${staff.role}</p>
            `;
        } else {
            staffCard.innerHTML = `
                <div class="staff-avatar">
                    <svg width="80" height="80" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                </div>
                <h3>${staff.name}</h3>
                <p class="staff-role">${staff.role}</p>
            `;
        }
        
        staffGrid.appendChild(staffCard);
    });
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById("adminModal");
    if (event.target === modal) {
        closeAdminModal();
    }
}

// Handle Enter key in admin code input
document.addEventListener("DOMContentLoaded", function() {
    const adminCodeInput = document.getElementById("adminCode");
    if (adminCodeInput) {
        adminCodeInput.addEventListener("keypress", function(e) {
            if (e.key === "Enter") {
                verifyAdminCode();
            }
        });
    }
});

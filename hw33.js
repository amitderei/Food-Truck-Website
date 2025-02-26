//logic layer

class order { /*father department- class of regular order*/
    constructor(customerName, phoneNum, email, inOrout, options, comments) { /*initializes the fields of the order*/
        this.customerName = customerName;
        this.phoneNum = phoneNum;
        this.email = email;
        this.inOrout = inOrout;
        this.options = options;
        this.comments = comments;
        this.setOrderTime(); // this function call to this function when new order
        this.items = {};
    }

    clone() { /*order clone */
        const clonedOrder = new order(this.customerName, this.phoneNum, this.email, this.inOrout, [...this.options], this.comments);
        for (const id in this.items) {
           clonedOrder.items[id] = this.items[id].clone();
        }
        return clonedOrder;
    }

    // add time to order
    setOrderTime() {
       this.time = getCurrentTime();
        }

    addItem(meal) { /*add meal to order*/
        if (this.items[meal.id]) {
            this.items[meal.id].quantity++;
        } else {
            this.items[meal.id] = meal.clone();
            this.items[meal.id].quantity = 1;
        }
    }

    removeItem(mealId) { /*remove meal to order*/
        if (this.items[mealId] && this.items[mealId].quantity>0) {
            this.items[mealId].quantity--;
        }
    }


    static Meal=class { /*create static class for meal*/
        constructor(id, name, price, quantity = 0) {
            this.id = id;
            this.name = name;
            this.price = price;
            this.quantity = quantity;
        }
    
        clone() { /*meal clone*/
            return new order.Meal(this.id, this.name, this.price, this.quantity);
        }
    }
}

class delivery extends order { /*son's department-delivery order that is like a regular order*/
    constructor(customerName, phoneNum, email, inOrout, options, comments, city, street, numberhouse){
        super(customerName, phoneNum, email, inOrout, options, comments);
            this.city=city;
            this.street=street;
            this.numberhouse=numberhouse;
    }

    clone(){ /*clone of delivery order*/
        const clonedOrder=new delivery(this.customerName, this.phoneNum, this.email, this.inOrout, [...this.options], this.comments, this.city, this.street, this.numberhouse);
        for (const id in this.items) {
            clonedOrder.items[id] = this.items[id].clone();
         }
         return clonedOrder;
    }
}


let meals = {/*creating each meal in the menu*/
    1: new order.Meal(1, 'נקניקיה בלחמנייה', 20),
    2: new order.Meal(2, 'שניצל בחלה', 40),
    3: new order.Meal(3, 'טורטייה אנטריקוט', 50),
    4: new order.Meal(4, 'נשנושי עוף', 30),
    5: new order.Meal(5, 'ווק אוז עם אסאדו', 45),
    6: new order.Meal(6, 'פלטת טוגנים', 55),
    7: new order.Meal(7, 'חומוס', 1),
    8: new order.Meal(8, 'מיונז', 1),
    9: new order.Meal(9, 'טחינה', 1),
    10: new order.Meal(10, 'שום', 1),
    11: new order.Meal(11, 'פסטו', 1),
    12: new order.Meal(12, 'צילי מתוק', 1),
    13: new order.Meal(13, 'חרדל', 1),
    14: new order.Meal(14, 'שזיפים', 1),
    15: new order.Meal(15, 'שום דבש', 1),
    16: new order.Meal(16, 'ברביקיו', 1),
    17: new order.Meal(17, 'גוואקמולה', 1),
    18: new order.Meal(18, 'חריף הבית', 1)
};

let currentOrder = new order('', '', '', '', [], ''); //create object of new order with empty fields

function isHebrew(text) { /*check if the input text is in Hebrew*/
    const hebrewPattern = /^[\u0590-\u05FF]+$/;
    return hebrewPattern.test(text);
}

function isEnglish(text) { /*check if the input text is in English*/
    const englishPattern = /^[a-zA-Z\s]+$/;
    return englishPattern.test(text);
}

function checkMeal(mealId) { /*add item to the cart*/
    currentOrder.addItem(meals[mealId]);
    var x= renderCart(); /*refresh the cart*/
}

function removeMeal(mealId) { /*remove item from the cart*/
    currentOrder.removeItem(mealId);
    var x=renderCart();
}

function getQuantity(mealId) { /*the function returns items quantity in the cart*/
    return currentOrder.items[mealId] ? currentOrder.items[mealId].quantity : 0;
}

function getCartOptions() { /*the funtion returns quantities of all items in the cart*/
    return Object.keys(meals).map(id =>getQuantity(id));
}

function renderCart() { 
    const cartItems = document.getElementById('cartItems');
    cartItems.innerHTML=''; // clearing the previous view of the cart
    let totalPrice=0;
    for (const mealId in currentOrder.items) {
        const item = currentOrder.items[mealId];
        if (item.quantity > 0) {
            const li = document.createElement('li'); /*create the element <li>*/
            const itemPrice = item.price * item.quantity;
            totalPrice += itemPrice;
            li.innerHTML = `${item.name} - ${item.quantity} * ${item.price}₪ = ${itemPrice}₪
                <button onclick="removeMeal(${mealId})">-</button>`; //create (-) button
            cartItems.appendChild(li); //add the element to the cart
        }
    }
    updateComments(); //call to function that update the comments
    document.getElementById('totalPrice').textContent = totalPrice;
    return totalPrice;
}

function deliveryDetails(){ //create fields for delivery details
    var newButton=`<tr><td>עיר:</td><td><input type="text" id="city" name="city"></td></tr>
    <tr><td>רחוב:</td><td><input type="text" id="street" name="street"></td></tr>
    <tr><td>מספר בית:</td><td><input type="text" id="numberhouse" name="numberhouse"></td></tr>`;
    document.getElementById("seatortake").innerHTML=newButton;

}

function closeDetails(){ /*close fields of delivery (if any)*/
    var clean=``;
    document.getElementById("seatortake").innerHTML=clean;
}

function checkText() { /*check the checks the input for correctness and call to function from data acess layer*/
    var customerName = trim(document.getElementById("customername").value);
    var phoneNum = trim(document.getElementById("phonenum").value);
    var email= trim(document.getElementById("email").value);
    var inside =document.getElementById("in").checked;
    var outside = document.getElementById("out").checked;
    var delivery= document.getElementById("delivery").checked;
    var inOrout = inside ? "לשבת" : (outside ? "לקחת" : "משלוח");
    var comments = (document.getElementById("comments").value);
    var res= document.getElementById("res");
    var alertmsg= "";
    var options = [];

    if (delivery){ /*if check on delivery option*/
        var city=document.getElementById("city").value;
        var street= document.getElementById("street").value;
        var numberhouse=document.getElementById("numberhouse").value;
        if (city === "") { /*if city field is empty*/
            alertmsg += "הזן עיר\n";
        }
        for (var i = 0; i < city.length; i++) {
            if (!isHebrew(city[i]) && !isEnglish(city[i]) && city[i] != " ") {
                alertmsg += "הזן עיר תקינה\n";
                break;
            }
        }

        if (street === "") { /*if street field is empty*/
            alertmsg += "הזן רחוב\n";
        }
        for (var i = 0; i < street.length; i++) {
            if (!isHebrew(street[i]) && !isEnglish(street[i]) && street[i] != " ") {
                alertmsg += "הזן רחוב תקין\n";
                break;
            }
        }

        if (numberhouse === "") { /*if house number is empty*/
            alertmsg += "הזן מספר בית \n";
        } else if (!/^\d+$/.test(numberhouse)) {
            alertmsg += "הזן מספר בית תקין\n";
        }
    
    }

    for (var i = 1; i < 19; i++) { /*go all the items in the cart to get the quantity of each item*/
        options.push(getQuantity(i));
    }

    if (customerName === "") {
        alertmsg += "הזן שם פרטי\n";
    }
    for (var i = 0; i < customerName.length; i++) {
        if (!isHebrew(customerName[i]) && !isEnglish(customerName[i]) && customerName[i] != " ") {
            alertmsg += "הזן שם תקין\n";
            break;
        }
    }

    if (phoneNum === "") {
        alertmsg += "הזן מספר טלפון\n";
    } else if (!/^\d+$/.test(phoneNum) || phoneNum.length != 10) {
        alertmsg += "הזן מספר טלפון תקין\n";
    }

    if (email === "") {
        alertmsg += "הזן כתובת דואר אלקטרוני\n";
    } else {
        if (!email.includes("@") || email.indexOf("@") !== email.lastIndexOf("@")) {
            alertmsg += "הזן כתובת דואל תקינה\n";
        } else {
            let domainPart = email.split("@")[1];
            if (!domainPart.includes(".")) {
                alertmsg += "הזן כתובת דואל תקינה\n";
            }
        }
    }

    if (comments === "הערות מיוחדות") { /*if the comment field doesnt changed*/
        comments = "אין";
    }

    if (!inside && !outside && !delivery) {
        alertmsg += "בחר אם לשבת או לקחת\n";
    }

    if (alertmsg === "") { 
        let orderOptions = getCartOptions(); /*gets all the quantities of all the items in the cart*/
        const clonedOrder = currentOrder.clone(); /*clone current order*/
        clonedOrder.customerName = customerName;
        clonedOrder.phoneNum = phoneNum;
        clonedOrder.email = email;
        clonedOrder.inOrout = inOrout;
        clonedOrder.options = orderOptions;
        clonedOrder.comments = comments;
        if(delivery){
            clonedOrder.city=city;
            clonedOrder.street=street;
            clonedOrder.numberhouse=numberhouse;
        }
        saveOrderToDb(clonedOrder.phoneNum, clonedOrder); //go to this funtion in hw44.js
        displayOrderSummary(clonedOrder); // show orders details
    } else {
        res.innerHTML = "";
        alert(alertmsg); //show the messege alert
    }
}


function displayOrderSummary(order) { //show the order details
    var totalPrice = renderCart();
    const orderTime = getCurrentTime();

    var summaryHTML = `
        <h2>סיכום הזמנה</h2>
        <p><strong>שם:</strong> ${order.customerName}</p>
        <p><strong>טלפון:</strong> ${order.phoneNum}</p>
        <p><strong>אימייל:</strong> ${order.email}</p>
        <p><strong>סוג הזמנה:</strong> ${order.inOrout}</p>`;
        
        if(order.inOrout==="משלוח"){ //if it is a delivery
            summaryHTML+=`<p><strong>עיר:</strong> ${order.city}</p>
            <p><strong>רחוב:</strong> ${order.street}</p>
            <p><strong>מספר בית:</strong> ${order.numberhouse}</p>`;
        }
        summaryHTML+=
        `<p><h3><strong>זמן ההזמנה:</strong></h3>${orderTime}</p>
        <h3>פריטים שהוזמנו:</h3>
        <ul> `;

    for (const mealId in order.items) { //go through all items and checks if ordered
        const item = order.items[mealId];
        if (item.quantity > 0) {
            const itemPrice = item.price * item.quantity;
            summaryHTML += `<li style="direction: rtl; text-align: right;"><bdi>${item.name}</bdi>: <bdi>${item.quantity} x ${item.price}₪ = ${itemPrice}₪</bdi></li>`;
        }
    }

    summaryHTML += `
        </ul>
        <p><strong>סה"כ לתשלום:</strong> ${totalPrice}₪</p>
        <p><strong>הערות:</strong> ${order.comments}</p>
    `;

    document.getElementById("res").innerHTML = summaryHTML;
}
 
function enterPass() { /*check the password in manager area*/
    var pass = document.getElementById("pwd").value;
    if (pass === "1234567890") {
        document.getElementById('pwd2').innerHTML = '';
        document.getElementById('password').innerHTML = getAllOrders();
    } else {
        document.getElementById('pwd2').innerHTML = "סיסמה שגויה!";
        document.getElementById('password').innerHTML = "";
    }
}


function trim(str) { //remove empty spaces from the begining and the end of the function
    return str.replace(/^\s+|\s+$/g, '');
}

function getAllOrders() { /*show all the orders in manager area*/
    var orders = getOrdersDb();
    var tableHTML = '<table border="1"><tr><th>מס\'</th><th>טלפון</th><th>שם</th><th>אימייל</th><th>משלוח/ישיבה/לקחת</th>' +
        `<th>עיר</th><th>רחוב</th><th>מספר בית</th>`+
        '<th>נקניקיית עוף</th><th>שניצל בחלה</th><th>טורטייה אנטריקוט</th><th>נשנושי עוף</th>' +
        '<th>ווק אורז עם אסאדו</th><th>פלטת טוגנים</th><th>חומוס</th><th>מיונז</th><th>טחינה</th>' +
        '<th>שום</th><th>פסטו</th><th>צ\'ילי מתוק</th><th>חרדל</th><th>שזיפים</th><th>שום-דבש</th>' +
        '<th>ברביקיו</th><th>גואקמולה</th><th>חריף הבית</th><th>הערות מיוחדות</th><th>זמן הזמנה</th><th>מחק</th></tr>';

    if (orders && orders.length > 0) { //put the details on the table
        for (var i = 0; i < orders.length; i++) {
            var order = orders[i];
            var j = i + 1;
            tableHTML+= '<tr>';
            tableHTML +=`<td>${j}</td>`;
            tableHTML += `<td>${order[0]}</td>`;
            tableHTML +=`<td>${order[1]}</td>`;
            tableHTML+= `<td>${order[2]}</td>`;
            tableHTML+= `<td>${order[3]}</td>`;
            tableHTML+=`<td>${order[24]}</td>`;
            tableHTML+=`<td>${order[25]}</td>`;
            tableHTML+=`<td>${order[26]}</td>`;
            for (var k = 4; k <= 21; k++) {
                tableHTML += `<td>${order[k] || '0'}</td>`;
            }
            tableHTML += `<td class="comments-cell">${order[22]}</td>`;
            tableHTML += `<td>${order[23]}</td>`; // Add the order time here
            tableHTML += `<td><button onclick="deleteOrderLogic('${order[0]}')">&#128465;</button></td>`; //create the garbage button
            tableHTML += '</tr>';
        }
        tableHTML += '</table>';
    } else {
        tableHTML = 'לא נמצאו הזמנות.';
    }
    return tableHTML;
}

function deleteOrderLogic(phoneNum){ /*the manager delete order*/
    deleteOrder(phoneNum); //call to function in hw44.js
    document.getElementById('password').innerHTML = getAllOrders();
}


function clearButton() { //clear the form and the cart
    document.getElementById("customername").value = "";
    updateCartTitle(); //clear the name of the cart
    document.getElementById("phonenum").value = "";
    document.getElementById("email").value = "";
    document.getElementById("in").checked=false;
    document.getElementById("out").checked=false;
    document.getElementById("delivery").checked=false;
    document.getElementById("adversting").checked=false;
    document.getElementById("city").value = "";
    document.getElementById("street").value = "";
    document.getElementById("numberhouse").value = "";
    document.getElementById("comments").value = "הערות מיוחדות";
    currentOrder.items= {};
    var x=renderCart();
    updateComments(); //clear the comments
    closeDetails();
    document.getElementById("res").innerHTML = "";
    document.getElementById("recentOrder").innerHTML = "";
}


function getCurrentTime() { //this funtion gets the hour
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function updateCartTitle() { /*on the time of input- update the name of the cart*/
    var customerName = document.getElementById('customername').value;
    var cartTitle = document.getElementById('cartTitle');
    if (customerName) {
        cartTitle.textContent = `עגלת הקניות של ${customerName}`;
    } else {
        cartTitle.textContent = 'עגלת קניות';
    }
}


function updateComments(){/*on the time of input- update the comments in the cart*/
    var comment= document.getElementById('comments').value;
    var comm= document.getElementById('comm');
    if (comment==='הערות מיוחדות'){
        comm.textContent='אין';
    }
    else{
        comm.textContent=comment;
    }
}

    $(document).ready(function(){
          $("#openAdminPopup").click(function(){
              $("#admin").fadeIn();
          });
          $("#openContactPopup").click(function(){
              $("#contact").fadeIn();
          });
        
          // Close popup when close button (X) is clicked
          $(".close").click(function(){
              $("#admin").fadeOut();
              $("#contact").fadeOut();
          });
      });
    
    $(document).ready(function () {
        $("#OrderAccordion").accordion({
              heightStyle: "content"});
    });
    
    function OpenAdmin()
    {
        window.location.href = "hw333.html?admin";
    }
    function OpenContact()
    {
        window.location.href = "hw333.html?contact";
    }

    // This function wait to the page to load and check if there parameters in the URL
window.addEventListener('load', function() {
    // Get the current URL
    const currentUrl = window.location.href;
    // Create a URL object
    const url = new URL(currentUrl);
    // Create a new object to work with the parameters we get
    const params = new URLSearchParams(url.search);
    // Check if a parameter 'admin' or 'contact' exists in url - open them
    if (params.has('admin')) {
        ClearUrlParams();
        $("#openAdminPopup").click(); 
    } 
    else if (params.has('contact'))
    {
        ClearUrlParams();
        $("#openContactPopup").click(); 
    }
    else
    {
        // delete parameters and update URL
        ClearUrlParams();
    }
    // Clear the search parameters
    url.search = '';
 
    // Update the browser's address bar without reloading the page
    history.pushState({}, document.title, url.toString());
  });
 
 
// This function to clear parameters from URL
  function ClearUrlParams()
  {
    // get the current URL
    const url = new URL(window.location.href);
    // clear the search parameters
    url.search = '';
 
    // update the browser address bar without reloading the page
    history.pushState({}, document.title, url.toString());
  }



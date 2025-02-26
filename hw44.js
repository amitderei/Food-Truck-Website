//Data access layer

//this function save into localStorage
function saveOrderToDb(phoneNum, order) {
     // if there is no delivery - put default in field
    if (order.inOrout!="משלוח"){
        order.city="אין";
        order.street="אין";
        order.numberhouse="אין";
    }
    // save as string the key phoneNum
    localStorage.setItem(phoneNum, JSON.stringify(order));
}

//this function get the orders from the localStorage (to present)
function getOrdersDb() {
    var orders = [];
    // loop to get all items in localStorage
    for (var i = 0; i < localStorage.length; i++) {
	//get the key of the order (phoneNum)
        var phoneNum = localStorage.key(i); 
	// decode the info parts of orders
        var orderInfo = JSON.parse(localStorage.getItem(phoneNum));

        var tmpOrder = [];
	// add to temp arr
        tmpOrder[0] = phoneNum;
        tmpOrder[1] = orderInfo.customerName;
        tmpOrder[2] = orderInfo.email;
        tmpOrder[3] = orderInfo.inOrout;
        for (var j = 0; j < 18; j++) {
            tmpOrder[4 + j] = orderInfo.options[j];
        }
        tmpOrder[22] = orderInfo.comments;
        tmpOrder[23] = orderInfo.time; // Retrieve the stored time
        tmpOrder[24]= orderInfo.city;
        tmpOrder[25]=orderInfo.street;
        tmpOrder[26]=orderInfo.numberhouse;
        orders.push(tmpOrder);
    }
    return orders;
}

// This order delete from localStorage
function deleteOrder(phoneNumber) {
    // delete by the key phone number
    localStorage.removeItem(phoneNumber);
}

var send = document.querySelector('.send');
send.addEventListener('click', run, false);

function run() {
    var open_time = document.querySelector('.time').value;
    var open_time_hour = open_time[0]+open_time[1]
    var open_time_min = open_time[3]+open_time[4]
    open_time = parseInt(open_time_hour*3600+open_time_min*60);
    console.log(open_time);
    var arrival_rate = document.querySelector('.AR').value; arrival_rate = parseFloat(arrival_rate);
    var service_rate = document.querySelector('.SR').value; service_rate = parseFloat(service_rate);
    var const_servicetime = 1 / service_rate * 60;
 
 
    var servers_num = document.querySelector('.S').value; servers_num = parseInt(servers_num);
    var servers = { name: [], end_time: [] };
    //用物件紀錄服務生名字和他上一次結束的時間，預設為0
    for (var i = 0; i < servers_num; i++) {
        servers.name.push('服務生' + (i + 1) + "號");
        servers.end_time.push(0);
    }
    var run = document.querySelector('.R').value;
    //第一位客人來的時間 
    var arrival_time = open_time + (-1 / arrival_rate) * (Math.log(Math.random() / Math.log(2.718)) * 60);
    //初始等待人數
    var queue = 0;
    //第一位客人的開始時間等於他到達的時間
    var start_time = arrival_time;
    var str = "<table border='1'> <tr><td>客戶編號</td><td>排隊人數</td><td>誰正在被服務中</td><td>到達時間</td><td>開始時間</td><td>服務結束</td><td>服務時間</td><td>服務生</td></tr>";
    var end_time = 0;
    var min_end_time = 1;
    var who_service_now = 0;



    var customer_data = { id: [], arrival_time: [], start_time: [], end_time: [] };
    for (var i = 1; i <= run; i++) {
       
        //每次的服務時間
        do{
            var servicetime =parseInt(60*randomExponential(service_rate)) ;
            
        }while(servicetime >= (const_servicetime+20) || servicetime <= (const_servicetime-20) );
      
        
        //記下起始時間
        var tmp_time = open_time;
        arrival_time += (-1 / arrival_rate) * (Math.log(Math.random() / Math.log(2.718)) * 3600);
        for (j = servers_num; j > 0; j--) {//找出服務生中最早的完成時間
            if (servers.end_time[j - 1] < min_end_time) {
                who_service_now = j - 1;
                min_end_time = servers.end_time[j - 1];
               
            }
        }

        if (servers.end_time[who_service_now] <= arrival_time) {//如果進場時間大於上次服務時間(服務生有空)
            start_time = arrival_time;
            servers.end_time[who_service_now] += servicetime;
            // if (queue > 0) {
            //     queue--;
            // }
        }
        else {//沒有服務生有空
            start_time = servers.end_time[who_service_now];
         //   queue++;
            servers.end_time[who_service_now] += servicetime;
        }

        // for (var j = queue; j > 0; j--) { //用queue中等待的數量去算原本等待中的人完成了嗎，如果完成了queue--
        //     if (customer_data.end_time[i - j ] < arrival_time) {
        //         queue--;
        //     }
        // }

        //將舊時間變數套用上本次修改的時間
        servers.end_time[who_service_now] = start_time + servicetime
        min_end_time = start_time + servicetime;
        open_time += servicetime;

        //轉換時間單位
        var dur = open_time - tmp_time;
        var arrivalhour = parseInt(arrival_time / 3600);
        var arrivalmin = parseInt(arrival_time / 60 % 60);
        if (arrivalmin < 10) {
            arrivalmin = arrivalmin.toString();
            arrivalmin = "0" + arrivalmin;

        }
        var arrivalsec = parseInt(arrival_time % 60);
        if (arrivalsec < 10) {
            arrivalsec = arrivalsec.toString();
            arrivalsec = "0" + arrivalsec;

        }
        var starthour = parseInt(start_time / 3600);
        var startmin = parseInt(start_time / 60 % 60);
        if (startmin < 10) {
            startmin = startmin.toString();
            startmin = "0" + startmin;

        }
        var startsec = parseInt(start_time % 60);
        if (startsec < 10) {
            startsec = startsec.toString();
            startsec = "0" + startsec;

        }
        var endhour = parseInt(servers.end_time[who_service_now] / 3600);
        var endmin = parseInt(servers.end_time[who_service_now] / 60 % 60);
        if (endmin < 10) {
            endmin = endmin.toString();
            endmin = "0" + endmin;

        }
        var endsec = parseInt(servers.end_time[who_service_now] % 60);
        if (endsec < 10) {
            endsec = endsec.toString();
            endsec = "0" + endsec;

        }

        //將本次顧客資料放入物件陣列
        customer_data.id.push(i);
        customer_data.arrival_time.push(arrival_time);
        customer_data.start_time.push(start_time);
        customer_data.end_time.push(servers.end_time[who_service_now]);


        var in_queue_str="";
        var max_id=0;
        for(var j =0;j<i;j++){
        
          if( customer_data.arrival_time[i - 1] >= customer_data.start_time[j] && customer_data.arrival_time[i - 1] <= customer_data.end_time[j]){
            if( customer_data.id[j]>max_id){
                max_id=customer_data.id[j];
            }
            if (in_queue_str == "") {
            in_queue_str +=  customer_data.id[j].toString();
             }
            else {
                in_queue_str += ' , ' +  customer_data.id[j].toString();;
            }
          }
        }
        console.log(customer_data.id[i - 1], 'aaaa',max_id)
        queue = customer_data.id[i - 1] - max_id;
        str += "<tr><td>" + i + "</td><td>" + queue + "</td><td>" + in_queue_str + "</td><td>" + arrivalhour + ":" + arrivalmin + ":" + arrivalsec + "</td><td>" + starthour + ":" + startmin + ":" + startsec + "</td><td>" + endhour + ":" + endmin + ":" + endsec + "</td><td>" + dur + "</td><td>" + servers.name[who_service_now] + "</td></tr>";
    }
    str += "</table>";
    document.getElementById("output").innerHTML = str;




    // //動畫
    // var count = 0;
    // //時間計算等動態表現
    // var tID = setInterval(myFunc01, 1000);
    // var time_str;
    // function myFunc01() {
    //     document.getElementById("simulate").innerHTML = time_str;
    //     time_str = '目前時間'+count+'秒' 
    //     console.log("已經過了" + count + "秒");
    //     count++;
    //     if (count >= 99999) {
    //         clearInterval(tID);
    //     }
    // }


    
   
}

//指數分布
function randomExponential(rate, randomUniform) {
    rate = rate || 1;
    var U = randomUniform;
    if (typeof randomUniform === 'function') U = randomUniform();
    if (!U) U = Math.random();
    return -Math.log(U)/rate;
  
  }



       //找出正在服務中的
        // var on_service = "";
        // for (var j = servers_num; j >= 1; j--) {
        //     //比對目前的"i - queue的數量 - 人手數目"後的那項結束時間是否小於目前的等待時間，因為多人會有bug所以要再判斷+2
        //     if (customer_data.end_time[i - queue - j] >= customer_data.arrival_time[i - 1]) {
        //         //方便整理格式而已
        //         if (customer_data.id[i - queue - j]) {
        //             if (on_service == "") {
        //                 on_service += customer_data.id[i - queue - j];
        //             }
        //             else {
        //                 on_service += ' , ' + customer_data.id[i - queue - j];
        //             }
        //         }
        //     }
        //     else {
        //         if (customer_data.end_time[i - queue - j + 2] >= customer_data.arrival_time[i - 1]) {
        //             //方便整理格式而已
        //             if (customer_data.id[i - queue - j]) {
        //                 if (on_service == "") {
        //                     on_service += customer_data.id[i - queue - j];
        //                 }
        //                 else {
        //                     on_service += ' , ' + customer_data.id[i - queue - j];
        //                 }
        //             }
        //         }
        //     }
        // }
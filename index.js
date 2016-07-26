var devices = [];

function instantiate_new() {
    var dev = {};
    dev.name = "New Device";
    dev.protocol = "TCP";
    if (devices.length) {
        dev.slave_id = devices.length;
    }
    else {
        dev.slave_id = 0;
    }
    dev.address = "192.168.23.1";
    dev.IP_Port = 502;
    dev.RTU_Baud_Rate = 9600;
    dev.RTU_Parity = "N";
    dev.RTU_Data_Bits = 8;
    dev.RTU_Stop_Bits = 1;
    dev.Discrete_Inputs_Start = 0;
    dev.Discrete_Inputs_Size = 8;
    dev.Coils_Start = 0;
    dev.Coils_Size = 4;
    dev.Input_Registers_Start = 0;
    dev.Input_Registers_Size = 10;
    dev.Holding_Registers_Start = 0;
    dev.Holding_Registers_Size = 5;
    return dev;
}

function download(filename, text) {
    console.log("Doing download");
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

function update_list()
{
    var list = $("#config_list");
    $(".config_list_item").remove();
    for (var dev in devices)
    {
        //console.log(devices[dev]);
        var elem = "<div id=\"";
        elem += "device_" + devices[dev].slave_id + "\"";
        elem += " class=\"config_list_item\">";
        elem += devices[dev].slave_id + " - " + devices[dev].name + "</div>";
        list.append(elem);
    }
}

$("#config_list_new").click(function(e) {
    devices.push(instantiate_new());
    console.log(devices);
    update_list();
});

$("#button_download").click(function(e) {
    var text = "";
    text += 'Num_Devices = "1" \n';
    text += '# ------------\n';
    text += '#   DEVICE 0\n';
    text += '# ------------\n';
    text += 'device0.name = "' + $('#device-name').val() + '"\n';
    text += 'device0.protocol = "' + $('#device-protocol').val() + '"\n';
    text += 'device0.slave_id = "' + $('#device-id').val() + '"\n';
    text += 'device0.address = "' + $('#device-address').val() + '"\n';
    text += 'device0.IP_Port = "' + $('#device-port').val() + '"\n';
    text += 'device0.RTU_Baud_Rate = "' + $('#device-rtu-baud').val() + '"\n';
    text += 'device0.RTU_Parity = "' + $('#device-rtu-parity').val() + '"\n';
    text += 'device0.RTU_Data_Bits = "' + $('#device-rtu-data').val() + '"\n';
    text += 'device0.RTU_Stop_Bits = "' + $('#device-rtu-stop').val() + '"\n';
    text += '\n';
    text += 'device0.Discrete_Inputs_Start = "' + $('#device-discrete-input-start').val() + '"\n';
    text += 'device0.Discrete_Inputs_Size = "' + $('#device-discrete-input-size').val() + '"\n';
    text += 'device0.Coils_Start = "' + $('#device-coils-start').val() + '"\n';
    text += 'device0.Coils_Size = "' + $('#device-coils-size').val() + '"\n';
    text += 'device0.Input_Registers_Start = "' + $('#device-input-registers-start').val() + '"\n';
    text += 'device0.Input_Registers_Size = "' + $('#device-input-registers-size').val() + '"\n';
    text += 'device0.Holding_Registers_Start = "' + $('#device-holding-registers-start').val() + '"\n';
    text += 'device0.Holding_Registers_Size = "' + $('#device-holding-registers-size').val() + '"\n';

    download("modbusdevice.cfg", text);
});

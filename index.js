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

function get_title(dev)
{
    var text = dev.slave_id + " - " + dev.name;
    return text;
}

function get_dev(text)
{
    for (var dev in devices)
    {
        var compare = get_title(devices[dev]);
        if (compare === text)
        {
            return dev;
        }
    }
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
        elem += get_title(devices[dev]) + "</div>";
        list.append(elem);
    }
    $(".config_list_item").click(function(e) {
        $(".config_list_item").removeClass("config_list_item_selected");
        var text = e.target.textContent;
        for (var dev in devices)
        {
            var compare = get_title(devices[dev]);
            if (compare === text)
            {
                set_values(devices[dev]);
                $(this).addClass("config_list_item_selected");
                break;
            }
        }
    });
}

function parseConfigFile(contents)
{
  devices = [];
  var text = contents.split('\n');
  var reg = {};

  reg.name = /^device(\d+)\.name.*"(.*)"/;
  reg.protocol = /^device(\d+)\.protocol.*"(.*)"$/;
  reg.slave_id = /^device(\d+)\.slave_id.*"(.*)"$/;
  reg.address = /^device(\d+)\.address.*"(.*)"$/;
  reg.IP_Port = /^device(\d+)\.IP_Port.*"(.*)"$/;
  reg.RTU_Baud_Rate = /^device(\d+)\.RTU_Baud_Rate.*"(.*)"$/;
  reg.RTU_Parity = /^device(\d+)\.RTU_Parity.*"(.*)"$/;
  reg.RTU_Data_Bits = /^device(\d+)\.RTU_Data_Bits.*"(.*)"$/;
  reg.RTU_Stop_Bits = /^device(\d+)\.RTU_Stop_Bits.*"(.*)"$/;
  reg.Discrete_Inputs_Start = /^device(\d+)\.Discrete_Inputs_Start.*"(.*)"$/;
  reg.Discrete_Inputs_Size = /^device(\d+)\.Discrete_Inputs_Size.*"(.*)"$/;
  reg.Coils_Start = /^device(\d+)\.Coils_Start.*"(.*)"$/;
  reg.Coils_Size = /^device(\d+)\.Coils_Size.*"(.*)"$/;
  reg.Input_Registers_Start = /^device(\d+)\.Input_Registers_Start.*"(.*)"$/;
  reg.Input_Registers_Size = /^device(\d+)\.Input_Registers_Size.*"(.*)"$/;
  reg.Holding_Registers_Start = /^device(\d+)\.Holding_Registers_Start.*"(.*)"$/;
  reg.Holding_Registers_Size = /^device(\d+)\.Holding_Registers_Size.*"(.*)"$/;

  for (var line in text)
  {
    for (var param in reg) {
      var result = reg[param].exec(text[line]);
      if (result) {
        /* 0 - full match
         * 1 - device number
         * 2 - param value
         * (1*string) creates a number
         */
        var dev = 1*result[1];
        console.log(line, dev, param, result);
        console.log(typeof devices[dev]);
        if (typeof(devices[dev]) !== 'object') {
          devices[dev] = {};
        }
        devices[dev][param] = result[2];
      }
    }
  }
  update_list();
  update_preview();
}

function readSingleFile(e) {
  var file = e.target.files[0];
  if (!file) {
    return;
  }
  var reader = new FileReader();
  reader.onload = function(e) {
    var contents = e.target.result;
    parseConfigFile(contents);
  };
  reader.readAsText(file);
}

document.getElementById('button_openFile').addEventListener('change', readSingleFile, false);

function set_values(dev)
{
    $('#device-name').val(dev.name);
    $('#device-protocol').val(dev.protocol);
    $('#device-id').val(dev.slave_id);
    $('#device-address').val(dev.address);
    $('#device-port').val(dev.IP_Port);
    $('#device-rtu-baud').val(dev.RTU_Baud_Rate);
    $('#device-rtu-parity').val(dev.RTU_Parity);
    $('#device-rtu-data').val(dev.RTU_Data_Bits);
    $('#device-rtu-stop').val(dev.RTU_Stop_Bits);
    $('#device-input-registers-start').val(dev.Input_Registers_Start);
    $('#device-input-registers-size').val(dev.Input_Registers_Size);
    $('#device-coils-start').val(dev.Coils_Start);
    $('#device-coils-size').val(dev.Coils_Size);
    $('#device-input-registers-start').val(dev.Input_Registers_Start);
    $('#device-input-registers-size').val(dev.Input_Registers_Size);
    $('#device-holding-registers-start').val(dev.Holding_Registers_Start);
    $('#device-holding-registers-size').val(dev.Holding_Registers_Size);
    update_protocol($('#device-protocol').val());
}

function update_protocol(protocol)
{
    if (protocol === "TCP") {
        $('.config_rtu').prop('disabled', true).css("color", "#040");
    }
    else {
        $('.config_rtu').prop('disabled', false).css("color", '#3f3');
    }
}

$("#config_list_new").click(function(e) {
    devices.push(instantiate_new());
    console.log(devices);
    update_list();
    update_preview();
});

function create_config()
{
    var text = 'Num_Devices = "' + devices.length + '" \n';
    for (var dev in devices)
    {
        var prefix = 'device' + dev;
        text += '\n# ------------\n';
        text += '#   DEVICE ' + dev + '\n';
        text += '# ------------\n';
        text += prefix + '.name = "' + devices[dev].name + '"\n';
        text += prefix + '.protocol = "' + devices[dev].protocol + '"\n';
        text += prefix + '.slave_id = "' + devices[dev].slave_id + '"\n';
        text += prefix + '.address = "' + devices[dev].address + '"\n';
        text += prefix + '.IP_Port = "' + devices[dev].IP_Port + '"\n';
        if (devices[dev].protocol === "TCP") {
            text += prefix + '.RTU_Baud_Rate = ""\n';
            text += prefix + '.RTU_Parity = ""\n';
            text += prefix + '.RTU_Data_Bits = ""\n';
            text += prefix + '.RTU_Stop_Bits = ""\n';
        }
        else {
            text += prefix + '.RTU_Baud_Rate = "' + devices[dev].RTU_Baud_Rate + '"\n';
            text += prefix + '.RTU_Parity = "' + devices[dev].RTU_Parity + '"\n';
            text += prefix + '.RTU_Data_Bits = "' + devices[dev].RTU_Data_Bits + '"\n';
            text += prefix + '.RTU_Stop_Bits = "' + devices[dev].RTU_Stop_Bits + '"\n';
        }
        text += prefix + '.Discrete_Inputs_Start = "' + devices[dev].Discrete_Inputs_Start + '"\n';
        text += prefix + '.Discrete_Inputs_Size = "' + devices[dev].Discrete_Inputs_Size + '"\n';
        text += prefix + '.Coils_Start = "' + devices[dev].Coils_Start + '"\n';
        text += prefix + '.Coils_Size = "' + devices[dev].Coils_Size + '"\n';
        text += prefix + '.Input_Registers_Start = "' + devices[dev].Input_Registers_Start + '"\n';
        text += prefix + '.Input_Registers_Size = "' + devices[dev].Input_Registers_Size + '"\n';
        text += prefix + '.Holding_Registers_Start = "' + devices[dev].Holding_Registers_Start + '"\n';
        text += prefix + '.Holding_Registers_Size = "' + devices[dev].Holding_Registers_Size + '"\n';
    }
    return(text);
}

$("#button_download").click(function(e) {
    download("modbusdevice.cfg", create_config());
});

function update_preview() {
    $('#config_preview').html(create_config().replace(/\n/g, '\n<br>'));
}

$('.config_values_input').change(function(e) {
    var elem = $('.config_list_item_selected');
    console.log(elem.text());
    var dev = get_dev(elem.text());
    var text;
    if ($('#device-name').val() !== devices[dev].name)
    {
        devices[dev].name = $('#device-name').val();
        text = get_title(devices[dev]);
        elem.text(text);
    }
    if ($('#device-id').val() !== devices[dev].slave_id)
    {
        devices[dev].slave_id = $('#device-id').val();
        text = get_title(devices[dev]);
        elem.text(text);
    }
    devices[dev].IP_Port = $('#device-port').val();
    devices[dev].protocol = $('#device-protocol').val();
    devices[dev].address = $('#device-address').val();
    devices[dev].RTU_Baud_Rate = $('#device-rtu-baud').val();
    devices[dev].RTU_Parity = $('#device-rtu-parity').val();
    devices[dev].RTU_Data_Bits = $('#device-rtu-data').val();
    devices[dev].RTU_Stop_Bits = $('#device-rtu-stop').val();
    devices[dev].Input_Registers_Start = $('#device-input-registers-start').val();
    devices[dev].Input_Registers_Size = $('#device-input-registers-size').val();
    devices[dev].Coils_Start = $('#device-coils-start').val();
    devices[dev].Coils_Size = $('#device-coils-size').val();
    devices[dev].Input_Registers_Start = $('#device-input-registers-start').val();
    devices[dev].Input_Registers_Size = $('#device-input-registers-size').val();
    devices[dev].Holding_Registers_Start = $('#device-holding-registers-start').val();
    devices[dev].Holding_Registers_Size = $('#device-holding-registers-size').val();

    update_protocol($('#device-protocol').val());
    update_preview();
});

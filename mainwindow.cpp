#include "mainwindow.h"
#include "ui_mainwindow.h"

MainWindow::MainWindow(QWidget *parent) :
    QMainWindow(parent),
    ui(new Ui::MainWindow)
{
    ui->setupUi(this);

    devices.clear();

    connect(ui->toolButton_addDevice, SIGNAL(clicked(bool)), this, SLOT(do_addDevice()));
    connect(ui->toolButton_delDevice, SIGNAL(clicked(bool)), this, SLOT(do_delDevice()));

    do_addDevice();

    ui->comboBox_deviceProtocol->clear();
    ui->comboBox_deviceProtocol->insertItem(0, "TCP", "TCP");
    ui->comboBox_deviceProtocol->insertItem(1, "RTU", "RTU");
    ui->comboBox_deviceProtocol->setCurrentIndex(0);

    ui->comboBox_deviceRtuParity->clear();
    ui->comboBox_deviceRtuParity->insertItem(0, "None", 'N');
    ui->comboBox_deviceRtuParity->insertItem(1, "Even", 'E');
    ui->comboBox_deviceRtuParity->insertItem(2, "Odd", 'O');
    ui->comboBox_deviceRtuParity->setCurrentIndex(0);

    connect_params();

    connect(ui->actionSave, SIGNAL(triggered(bool)), this, SLOT(write_config()));
}

MainWindow::~MainWindow()
{
    delete ui;
}

void MainWindow::connect_params()
{
    connect(ui->listWidget_devices, SIGNAL(currentRowChanged(int)), this, SLOT(do_displayDeviceSettings(int)));

    connect(ui->comboBox_deviceProtocol, SIGNAL(currentIndexChanged(QString)), this, SLOT(do_updateProtocol(QString)));
    connect(ui->comboBox_deviceProtocol, SIGNAL(currentIndexChanged(int)), this, SLOT(do_updateDevice()));
    connect(ui->lineEdit_deviceName, SIGNAL(editingFinished()), this, SLOT(do_updateDevice()));
    connect(ui->lineEdit_deviceAddress, SIGNAL(editingFinished()), this, SLOT(do_updateDevice()));
    connect(ui->spinBox_deviceCoilsSize, SIGNAL(editingFinished()), this, SLOT(do_updateDevice()));
    connect(ui->spinBox_deviceCoilsStart, SIGNAL(editingFinished()), this, SLOT(do_updateDevice()));
    connect(ui->spinBox_deviceDiscreteInputsSize, SIGNAL(editingFinished()), this, SLOT(do_updateDevice()));
    connect(ui->spinBox_deviceDiscreteInputsStart, SIGNAL(editingFinished()), this, SLOT(do_updateDevice()));
    connect(ui->spinBox_deviceHoldingRegistersSize, SIGNAL(editingFinished()), this, SLOT(do_updateDevice()));
    connect(ui->spinBox_deviceHoldingRegistersStart, SIGNAL(editingFinished()), this, SLOT(do_updateDevice()));
    connect(ui->spinBox_deviceInputRegistersSize, SIGNAL(editingFinished()), this, SLOT(do_updateDevice()));
    connect(ui->spinBox_deviceInputRegistersStart, SIGNAL(editingFinished()), this, SLOT(do_updateDevice()));
    connect(ui->spinBox_deviceIpPort, SIGNAL(editingFinished()), this, SLOT(do_updateDevice()));
    connect(ui->spinBox_deviceRtuBaudRate, SIGNAL(editingFinished()), this, SLOT(do_updateDevice()));
    connect(ui->spinBox_deviceRtuDataBits, SIGNAL(editingFinished()), this, SLOT(do_updateDevice()));
    connect(ui->spinBox_deviceRtuStopBits, SIGNAL(editingFinished()), this, SLOT(do_updateDevice()));
    connect(ui->spinBox_deviceSlaveID, SIGNAL(editingFinished()), this, SLOT(do_updateDevice()));
}

void MainWindow::disconnect_params()
{
    disconnect(ui->listWidget_devices, SIGNAL(currentRowChanged(int)), this, SLOT(do_displayDeviceSettings(int)));

    disconnect(ui->comboBox_deviceProtocol, SIGNAL(currentIndexChanged(QString)), this, SLOT(do_updateProtocol(QString)));
    disconnect(ui->comboBox_deviceProtocol, SIGNAL(currentIndexChanged(int)), this, SLOT(do_updateDevice()));
    disconnect(ui->lineEdit_deviceName, SIGNAL(editingFinished()), this, SLOT(do_updateDevice()));
    disconnect(ui->lineEdit_deviceAddress, SIGNAL(editingFinished()), this, SLOT(do_updateDevice()));
    disconnect(ui->spinBox_deviceCoilsSize, SIGNAL(editingFinished()), this, SLOT(do_updateDevice()));
    disconnect(ui->spinBox_deviceCoilsStart, SIGNAL(editingFinished()), this, SLOT(do_updateDevice()));
    disconnect(ui->spinBox_deviceDiscreteInputsSize, SIGNAL(editingFinished()), this, SLOT(do_updateDevice()));
    disconnect(ui->spinBox_deviceDiscreteInputsStart, SIGNAL(editingFinished()), this, SLOT(do_updateDevice()));
    disconnect(ui->spinBox_deviceHoldingRegistersSize, SIGNAL(editingFinished()), this, SLOT(do_updateDevice()));
    disconnect(ui->spinBox_deviceHoldingRegistersStart, SIGNAL(editingFinished()), this, SLOT(do_updateDevice()));
    disconnect(ui->spinBox_deviceInputRegistersSize, SIGNAL(editingFinished()), this, SLOT(do_updateDevice()));
    disconnect(ui->spinBox_deviceInputRegistersStart, SIGNAL(editingFinished()), this, SLOT(do_updateDevice()));
    disconnect(ui->spinBox_deviceIpPort, SIGNAL(editingFinished()), this, SLOT(do_updateDevice()));
    disconnect(ui->spinBox_deviceRtuBaudRate, SIGNAL(editingFinished()), this, SLOT(do_updateDevice()));
    disconnect(ui->spinBox_deviceRtuDataBits, SIGNAL(editingFinished()), this, SLOT(do_updateDevice()));
    disconnect(ui->spinBox_deviceRtuStopBits, SIGNAL(editingFinished()), this, SLOT(do_updateDevice()));
    disconnect(ui->spinBox_deviceSlaveID, SIGNAL(editingFinished()), this, SLOT(do_updateDevice()));
}

void MainWindow::deviceInstantiate(mbDevice * device, int index)
{
    device->name = "Default Slave";
    device->protocol = "TCP";
    device->slave_id = index;
    device->address = "192.168.23.1";
    device->IP_port = 502;
    device->RTU_Baud_Rate = 9600;
    device->RTU_Parity = 'N';
    device->RTU_Data_Bits = 8;
    device->RTU_Stop_Bits = 1;
    device->Discrete_Inputs_Start = 0;
    device->Discrete_Inputs_Size = 8;
    device->Coils_Start = 0;
    device->Coils_Size = 4;
    device->Input_Registers_Start = 0;
    device->Input_Registers_Size = 10;
    device->Holding_Registers_Start = 0;
    device->Holding_Registers_Size = 5;
}

void MainWindow::dump_devices()
{
    for (int index = 0; index < devices.size(); index++)
    {
        mbDevice dev = devices.at(index);
        qDebug() << "Device: " << index;
        qDebug() << dev.name;
        qDebug() << dev.protocol;
        qDebug() << dev.slave_id;
        qDebug() << dev.address;
        qDebug() << dev.IP_port;
        qDebug() << dev.RTU_Baud_Rate;
        qDebug() << dev.RTU_Parity;
        qDebug() << dev.RTU_Data_Bits;
        qDebug() << dev.RTU_Stop_Bits;
        qDebug() << dev.Discrete_Inputs_Start;
        qDebug() << dev.Discrete_Inputs_Size;
        qDebug() << dev.Coils_Start;
        qDebug() << dev.Coils_Size;
        qDebug() << dev.Input_Registers_Start;
        qDebug() << dev.Input_Registers_Size;
        qDebug() << dev.Holding_Registers_Start;
        qDebug() << dev.Holding_Registers_Size;
    }
}

void MainWindow::do_addDevice()
{
    mbDevice newDevice;
    int index = 1;
    if (!devices.isEmpty())
    {
        index = devices.last().slave_id + 1;
    }
    qDebug() << "add row: " << index;
    deviceInstantiate(&newDevice, index);
    devices.push_back(newDevice);
    QListWidgetItem * newitem = new QListWidgetItem;
    newitem->setText(QString::number(index));
    ui->listWidget_devices->addItem(newitem);
}

void MainWindow::do_delDevice()
{
    int index = ui->listWidget_devices->currentRow();
    qDebug() << "Del row: " << index;
    if (index < 0 || index > devices.count())
    {
        qDebug() << "Device doesn't exist? Not trying to delete.";
        return;
    }
    devices.removeAt(index);
    QListWidgetItem * delItem = ui->listWidget_devices->item(index);
    delete delItem;
    dump_devices();
}

void MainWindow::do_updateProtocol(QString protocol)
{
    //QString protocol = ui->comboBox_deviceProtocol->currentData().toString();
    if (protocol == "TCP")
    {
        ui->spinBox_deviceRtuBaudRate->setEnabled(false);
        ui->comboBox_deviceRtuParity->setEnabled(false);
        ui->spinBox_deviceRtuDataBits->setEnabled(false);
        ui->spinBox_deviceRtuStopBits->setEnabled(false);
    }
    else
    {
        ui->spinBox_deviceRtuBaudRate->setEnabled(true);
        ui->comboBox_deviceRtuParity->setEnabled(true);
        ui->spinBox_deviceRtuDataBits->setEnabled(true);
        ui->spinBox_deviceRtuStopBits->setEnabled(true);
    }
}

void MainWindow::do_displayDeviceSettings(int index)
{
    //int index = ui->listWidget_devices->currentRow();
    mbDevice dev = devices.at(index);

    ui->lineEdit_deviceName->setText(dev.name);
    ui->comboBox_deviceProtocol->setCurrentText(dev.protocol);
    ui->spinBox_deviceSlaveID->setValue(dev.slave_id);
    ui->lineEdit_deviceAddress->setText(dev.address);
    ui->spinBox_deviceIpPort->setValue(dev.IP_port);
    ui->spinBox_deviceRtuBaudRate->setValue(dev.RTU_Baud_Rate);
    ui->comboBox_deviceRtuParity->setCurrentText(dev.RTU_Parity);
    ui->spinBox_deviceRtuDataBits->setValue(dev.RTU_Data_Bits);
    ui->spinBox_deviceRtuStopBits->setValue(dev.RTU_Stop_Bits);
    ui->spinBox_deviceDiscreteInputsStart->setValue(dev.Discrete_Inputs_Start);
    ui->spinBox_deviceDiscreteInputsSize->setValue(dev.Discrete_Inputs_Size);
    ui->spinBox_deviceCoilsStart->setValue(dev.Coils_Start);
    ui->spinBox_deviceCoilsSize->setValue(dev.Coils_Size);
    ui->spinBox_deviceInputRegistersStart->setValue(dev.Input_Registers_Start);
    ui->spinBox_deviceInputRegistersSize->setValue(dev.Input_Registers_Size);
    ui->spinBox_deviceHoldingRegistersStart->setValue(dev.Holding_Registers_Start);
    ui->spinBox_deviceHoldingRegistersSize->setValue(dev.Holding_Registers_Size);

    do_updateProtocol(dev.protocol);
}

void MainWindow::do_updateDevice()
{
    int index = ui->listWidget_devices->currentRow();
    mbDevice dev = devices.at(index);

    qDebug() << "Device to update: " << index;
    if (index < 0 || index > devices.count())
    {
        qDebug() << "Device doesn't exist? Not trying to update.";
        return;
    }

    dev.name = ui->lineEdit_deviceName->text();
    dev.protocol = ui->comboBox_deviceProtocol->currentText();
    dev.slave_id = ui->spinBox_deviceSlaveID->value();
    dev.address = ui->lineEdit_deviceAddress->text();
    dev.IP_port = ui->spinBox_deviceIpPort->value();
    dev.RTU_Baud_Rate = ui->spinBox_deviceRtuBaudRate->value();
    dev.RTU_Parity = ui->comboBox_deviceRtuParity->currentData().toChar();
    dev.RTU_Data_Bits = ui->spinBox_deviceRtuDataBits->value();
    dev.RTU_Stop_Bits = ui->spinBox_deviceRtuStopBits->value();
    dev.Discrete_Inputs_Start = ui->spinBox_deviceDiscreteInputsStart->value();
    dev.Discrete_Inputs_Size = ui->spinBox_deviceDiscreteInputsSize->value();
    dev.Coils_Start = ui->spinBox_deviceCoilsStart->value();
    dev.Coils_Size = ui->spinBox_deviceCoilsSize->value();
    dev.Input_Registers_Start = ui->spinBox_deviceInputRegistersStart->value();
    dev.Input_Registers_Size = ui->spinBox_deviceInputRegistersSize->value();
    dev.Holding_Registers_Start = ui->spinBox_deviceHoldingRegistersStart->value();
    dev.Holding_Registers_Size = ui->spinBox_deviceHoldingRegistersSize->value();

    devices.replace(index, dev);
}

void MainWindow::write_config()
{
    QString filename;
    filename = QFileDialog::getSaveFileName(this, tr("Select File"), "/home/", tr("*.cfg"));
    qDebug() << filename;
    QFile file(filename);
    if (!file.open(QIODevice::WriteOnly))
    {
        qDebug() << "Error opening file for writing.";
        return;
    }
    QTextStream out(&file);
    out << "#" << endl
        << "# Modbus Device Configuration File" << endl
        << "# Generated by modbusconf (https://github.com/ctag/modbusconf)" << endl
        << "#" << endl;
    out << "Num_Devices = \"" << devices.count() << "\"" << endl;
    for (int index = 0; index < devices.count(); index++)
    {
        mbDevice dev = devices.at(index);
        QString prefix = "device" + QString::number(index) + ".";
        out << endl << "# ------------" << endl
             << "#   DEVICE " << index << endl
             << "# ------------" << endl;
        out << prefix << "name = \"" << dev.name << "\"" << endl;
        out << prefix << "protocol = \"" << dev.protocol << "\"" << endl;
        out << prefix << "slave_id = \"" << dev.slave_id << "\"" << endl;
        out << prefix << "address = \"" << dev.address << "\"" << endl;
        out << prefix << "IP_Port = \"" << dev.IP_port << "\"" << endl;
        if (dev.protocol == "RTU")
        {
            out << prefix << "RTU_Baud_Rate = \"" << dev.RTU_Baud_Rate << "\"" << endl;
            out << prefix << "RTU_Parity = \"" << dev.RTU_Parity << "\"" << endl;
            out << prefix << "RTU_Data_Bits = \"" << dev.RTU_Data_Bits << "\"" << endl;
            out << prefix << "RTU_Stop_Bits = \"" << dev.RTU_Stop_Bits << "\"" << endl;
        }
        else
        {
            out << prefix << "RTU_Baud_Rate = \"\"" << endl;
            out << prefix << "RTU_Parity = \"\"" << endl;
            out << prefix << "RTU_Data_Bits = \"\"" << endl;
            out << prefix << "RTU_Stop_Bits = \"\"" << endl;
        }
        out << prefix << "Discrete_Inputs_Start = \"" << dev.Discrete_Inputs_Start << "\"" << endl;
        out << prefix << "Discrete_Inputs_Size = \"" << dev.Discrete_Inputs_Size << "\"" << endl;
        out << prefix << "Coils_Start = \"" << dev.Coils_Start << "\"" << endl;
        out << prefix << "Coils_Size = \"" << dev.Coils_Size << "\"" << endl;
        out << prefix << "Input_Registers_Start = \"" << dev.Input_Registers_Start << "\"" << endl;
        out << prefix << "Input_Registers_Size = \"" << dev.Input_Registers_Size << "\"" << endl;
        out << prefix << "Holding_Registers_Start = \"" << dev.Holding_Registers_Start << "\"" << endl;
        out << prefix << "Holding_Registers_Size = \"" << dev.Holding_Registers_Size << "\"" << endl;
    }
    file.close();
}



















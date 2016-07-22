#ifndef MAINWINDOW_H
#define MAINWINDOW_H

#include <QMainWindow>
#include <QString>
#include <QList>
#include <QFileDialog>
#include <QDebug>
#include <QFile>

struct mbDevice {
    QString name;
    QString protocol;
    int slave_id;
    QString address;
    int IP_port;
    int RTU_Baud_Rate;
    QChar RTU_Parity;
    int RTU_Data_Bits;
    int RTU_Stop_Bits;
    int Discrete_Inputs_Start;
    int Discrete_Inputs_Size;
    int Coils_Start;
    int Coils_Size;
    int Input_Registers_Start;
    int Input_Registers_Size;
    int Holding_Registers_Start;
    int Holding_Registers_Size;
};

namespace Ui {
class MainWindow;
}

class MainWindow : public QMainWindow
{
    Q_OBJECT

public:
    explicit MainWindow(QWidget *parent = 0);
    ~MainWindow();

public slots:
    void do_updateProtocol(QString protocol);
    void do_displayDeviceSettings(int index);
    void do_updateDevice();
    void do_addDevice();
    void do_delDevice();
    void write_config();

protected:
    void deviceInstantiate(mbDevice * device, int index);
    void connect_params();
    void disconnect_params();
    void dump_devices();

private:
    Ui::MainWindow *ui;
    QList<mbDevice> devices;
};

#endif // MAINWINDOW_H

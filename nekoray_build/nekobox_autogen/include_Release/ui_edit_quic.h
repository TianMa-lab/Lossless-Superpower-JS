/********************************************************************************
** Form generated from reading UI file 'edit_quic.ui'
**
** Created by: Qt User Interface Compiler version 5.15.2
**
** WARNING! All changes made in this file will be lost when recompiling UI file!
********************************************************************************/

#ifndef UI_EDIT_QUIC_H
#define UI_EDIT_QUIC_H

#include <QtCore/QVariant>
#include <QtWidgets/QApplication>
#include <QtWidgets/QCheckBox>
#include <QtWidgets/QComboBox>
#include <QtWidgets/QGridLayout>
#include <QtWidgets/QHBoxLayout>
#include <QtWidgets/QLabel>
#include <QtWidgets/QPushButton>
#include <QtWidgets/QSpacerItem>
#include <QtWidgets/QVBoxLayout>
#include <QtWidgets/QWidget>
#include "ui/widget/MyLineEdit.h"

QT_BEGIN_NAMESPACE

class Ui_EditQUIC
{
public:
    QVBoxLayout *verticalLayout;
    QGridLayout *upBox;
    QHBoxLayout *downloadMbpsLay;
    QLabel *downloadMbps_l;
    MyLineEdit *downloadMbps;
    QHBoxLayout *hopPortLay;
    QLabel *hopPort_l;
    MyLineEdit *hopPort;
    QHBoxLayout *hopIntervalLay;
    QLabel *hopInterval_l;
    MyLineEdit *hopInterval;
    QHBoxLayout *heartbeatLay;
    QLabel *heartbeat_l;
    MyLineEdit *heartbeat;
    QHBoxLayout *uploadMbpsLay;
    QLabel *uploadMbps_l;
    MyLineEdit *uploadMbps;
    QCheckBox *zeroRttHandshake;
    QHBoxLayout *congestionControlLay;
    QLabel *congestionControl_l;
    QComboBox *congestionControl;
    QHBoxLayout *udpRelayModeLay;
    QLabel *udpRelayMode_l;
    QComboBox *udpRelayMode;
    QHBoxLayout *horizontalLayout;
    QCheckBox *forceExternal;
    QCheckBox *uos;
    QCheckBox *disableMtuDiscovery;
    QGridLayout *obfuscation;
    MyLineEdit *obfsPassword;
    QLabel *obfsPassword_l;
    QGridLayout *authentication;
    QPushButton *uuidgen;
    QLabel *uuid_l;
    MyLineEdit *uuid;
    QLabel *password_l;
    MyLineEdit *password;
    QGridLayout *TLS;
    QLabel *certificate_l;
    QPushButton *certificate;
    MyLineEdit *alpn;
    QCheckBox *disableSni;
    MyLineEdit *sni;
    QLabel *alpn_l;
    QLabel *sni_l;
    QCheckBox *allowInsecure;
    QSpacerItem *alpn_sp;
    QHBoxLayout *flowControlWindow;
    QLabel *streamReceiveWindow_l;
    MyLineEdit *streamReceiveWindow;
    QLabel *connectionReceiveWindow_l;
    MyLineEdit *connectionReceiveWindow;

    void setupUi(QWidget *EditQUIC)
    {
        if (EditQUIC->objectName().isEmpty())
            EditQUIC->setObjectName(QString::fromUtf8("EditQUIC"));
        EditQUIC->resize(500, 628);
        EditQUIC->setWindowTitle(QString::fromUtf8("EditHysteria"));
        verticalLayout = new QVBoxLayout(EditQUIC);
        verticalLayout->setObjectName(QString::fromUtf8("verticalLayout"));
        upBox = new QGridLayout();
        upBox->setObjectName(QString::fromUtf8("upBox"));
        downloadMbpsLay = new QHBoxLayout();
        downloadMbpsLay->setObjectName(QString::fromUtf8("downloadMbpsLay"));
        downloadMbps_l = new QLabel(EditQUIC);
        downloadMbps_l->setObjectName(QString::fromUtf8("downloadMbps_l"));

        downloadMbpsLay->addWidget(downloadMbps_l);

        downloadMbps = new MyLineEdit(EditQUIC);
        downloadMbps->setObjectName(QString::fromUtf8("downloadMbps"));

        downloadMbpsLay->addWidget(downloadMbps);


        upBox->addLayout(downloadMbpsLay, 1, 1, 1, 1);

        hopPortLay = new QHBoxLayout();
        hopPortLay->setObjectName(QString::fromUtf8("hopPortLay"));
        hopPort_l = new QLabel(EditQUIC);
        hopPort_l->setObjectName(QString::fromUtf8("hopPort_l"));

        hopPortLay->addWidget(hopPort_l);

        hopPort = new MyLineEdit(EditQUIC);
        hopPort->setObjectName(QString::fromUtf8("hopPort"));

        hopPortLay->addWidget(hopPort);


        upBox->addLayout(hopPortLay, 0, 0, 1, 1);

        hopIntervalLay = new QHBoxLayout();
        hopIntervalLay->setObjectName(QString::fromUtf8("hopIntervalLay"));
        hopInterval_l = new QLabel(EditQUIC);
        hopInterval_l->setObjectName(QString::fromUtf8("hopInterval_l"));

        hopIntervalLay->addWidget(hopInterval_l);

        hopInterval = new MyLineEdit(EditQUIC);
        hopInterval->setObjectName(QString::fromUtf8("hopInterval"));

        hopIntervalLay->addWidget(hopInterval);


        upBox->addLayout(hopIntervalLay, 0, 1, 1, 1);

        heartbeatLay = new QHBoxLayout();
        heartbeatLay->setObjectName(QString::fromUtf8("heartbeatLay"));
        heartbeat_l = new QLabel(EditQUIC);
        heartbeat_l->setObjectName(QString::fromUtf8("heartbeat_l"));

        heartbeatLay->addWidget(heartbeat_l);

        heartbeat = new MyLineEdit(EditQUIC);
        heartbeat->setObjectName(QString::fromUtf8("heartbeat"));
        QSizePolicy sizePolicy(QSizePolicy::Preferred, QSizePolicy::Fixed);
        sizePolicy.setHorizontalStretch(0);
        sizePolicy.setVerticalStretch(0);
        sizePolicy.setHeightForWidth(heartbeat->sizePolicy().hasHeightForWidth());
        heartbeat->setSizePolicy(sizePolicy);

        heartbeatLay->addWidget(heartbeat);


        upBox->addLayout(heartbeatLay, 3, 0, 1, 1);

        uploadMbpsLay = new QHBoxLayout();
        uploadMbpsLay->setObjectName(QString::fromUtf8("uploadMbpsLay"));
        uploadMbps_l = new QLabel(EditQUIC);
        uploadMbps_l->setObjectName(QString::fromUtf8("uploadMbps_l"));

        uploadMbpsLay->addWidget(uploadMbps_l);

        uploadMbps = new MyLineEdit(EditQUIC);
        uploadMbps->setObjectName(QString::fromUtf8("uploadMbps"));

        uploadMbpsLay->addWidget(uploadMbps);


        upBox->addLayout(uploadMbpsLay, 1, 0, 1, 1);

        zeroRttHandshake = new QCheckBox(EditQUIC);
        zeroRttHandshake->setObjectName(QString::fromUtf8("zeroRttHandshake"));

        upBox->addWidget(zeroRttHandshake, 3, 1, 1, 1);

        congestionControlLay = new QHBoxLayout();
        congestionControlLay->setObjectName(QString::fromUtf8("congestionControlLay"));
        congestionControl_l = new QLabel(EditQUIC);
        congestionControl_l->setObjectName(QString::fromUtf8("congestionControl_l"));

        congestionControlLay->addWidget(congestionControl_l);

        congestionControl = new QComboBox(EditQUIC);
        congestionControl->addItem(QString::fromUtf8("bbr"));
        congestionControl->addItem(QString::fromUtf8("cubic"));
        congestionControl->addItem(QString::fromUtf8("new_reno"));
        congestionControl->setObjectName(QString::fromUtf8("congestionControl"));

        congestionControlLay->addWidget(congestionControl);


        upBox->addLayout(congestionControlLay, 2, 0, 1, 1);

        udpRelayModeLay = new QHBoxLayout();
        udpRelayModeLay->setObjectName(QString::fromUtf8("udpRelayModeLay"));
        udpRelayMode_l = new QLabel(EditQUIC);
        udpRelayMode_l->setObjectName(QString::fromUtf8("udpRelayMode_l"));

        udpRelayModeLay->addWidget(udpRelayMode_l);

        udpRelayMode = new QComboBox(EditQUIC);
        udpRelayMode->addItem(QString::fromUtf8("native"));
        udpRelayMode->addItem(QString::fromUtf8("quic"));
        udpRelayMode->setObjectName(QString::fromUtf8("udpRelayMode"));

        udpRelayModeLay->addWidget(udpRelayMode);


        upBox->addLayout(udpRelayModeLay, 2, 1, 1, 1);


        verticalLayout->addLayout(upBox);

        horizontalLayout = new QHBoxLayout();
        horizontalLayout->setObjectName(QString::fromUtf8("horizontalLayout"));
        forceExternal = new QCheckBox(EditQUIC);
        forceExternal->setObjectName(QString::fromUtf8("forceExternal"));

        horizontalLayout->addWidget(forceExternal);

        uos = new QCheckBox(EditQUIC);
        uos->setObjectName(QString::fromUtf8("uos"));
#if QT_CONFIG(tooltip)
        uos->setToolTip(QString::fromUtf8("Requires sing-box server"));
#endif // QT_CONFIG(tooltip)
        uos->setText(QString::fromUtf8("UDP over Stream"));

        horizontalLayout->addWidget(uos);

        disableMtuDiscovery = new QCheckBox(EditQUIC);
        disableMtuDiscovery->setObjectName(QString::fromUtf8("disableMtuDiscovery"));
        QSizePolicy sizePolicy1(QSizePolicy::Maximum, QSizePolicy::Fixed);
        sizePolicy1.setHorizontalStretch(0);
        sizePolicy1.setVerticalStretch(0);
        sizePolicy1.setHeightForWidth(disableMtuDiscovery->sizePolicy().hasHeightForWidth());
        disableMtuDiscovery->setSizePolicy(sizePolicy1);

        horizontalLayout->addWidget(disableMtuDiscovery);


        verticalLayout->addLayout(horizontalLayout);

        obfuscation = new QGridLayout();
        obfuscation->setObjectName(QString::fromUtf8("obfuscation"));
        obfsPassword = new MyLineEdit(EditQUIC);
        obfsPassword->setObjectName(QString::fromUtf8("obfsPassword"));

        obfuscation->addWidget(obfsPassword, 0, 1, 1, 1);

        obfsPassword_l = new QLabel(EditQUIC);
        obfsPassword_l->setObjectName(QString::fromUtf8("obfsPassword_l"));

        obfuscation->addWidget(obfsPassword_l, 0, 0, 1, 1);


        verticalLayout->addLayout(obfuscation);

        authentication = new QGridLayout();
        authentication->setObjectName(QString::fromUtf8("authentication"));
        uuidgen = new QPushButton(EditQUIC);
        uuidgen->setObjectName(QString::fromUtf8("uuidgen"));

        authentication->addWidget(uuidgen, 0, 2, 1, 1);

        uuid_l = new QLabel(EditQUIC);
        uuid_l->setObjectName(QString::fromUtf8("uuid_l"));
        uuid_l->setText(QString::fromUtf8("UUID"));

        authentication->addWidget(uuid_l, 0, 0, 1, 1);

        uuid = new MyLineEdit(EditQUIC);
        uuid->setObjectName(QString::fromUtf8("uuid"));

        authentication->addWidget(uuid, 0, 1, 1, 1);

        password_l = new QLabel(EditQUIC);
        password_l->setObjectName(QString::fromUtf8("password_l"));
        QSizePolicy sizePolicy2(QSizePolicy::Maximum, QSizePolicy::Preferred);
        sizePolicy2.setHorizontalStretch(0);
        sizePolicy2.setVerticalStretch(0);
        sizePolicy2.setHeightForWidth(password_l->sizePolicy().hasHeightForWidth());
        password_l->setSizePolicy(sizePolicy2);

        authentication->addWidget(password_l, 1, 0, 1, 1);

        password = new MyLineEdit(EditQUIC);
        password->setObjectName(QString::fromUtf8("password"));

        authentication->addWidget(password, 1, 1, 1, 2);


        verticalLayout->addLayout(authentication);

        TLS = new QGridLayout();
        TLS->setObjectName(QString::fromUtf8("TLS"));
        certificate_l = new QLabel(EditQUIC);
        certificate_l->setObjectName(QString::fromUtf8("certificate_l"));

        TLS->addWidget(certificate_l, 2, 0, 1, 1);

        certificate = new QPushButton(EditQUIC);
        certificate->setObjectName(QString::fromUtf8("certificate"));
        certificate->setText(QString::fromUtf8("PushButton"));

        TLS->addWidget(certificate, 2, 1, 1, 1);

        alpn = new MyLineEdit(EditQUIC);
        alpn->setObjectName(QString::fromUtf8("alpn"));

        TLS->addWidget(alpn, 1, 1, 1, 1);

        disableSni = new QCheckBox(EditQUIC);
        disableSni->setObjectName(QString::fromUtf8("disableSni"));

        TLS->addWidget(disableSni, 0, 2, 1, 1);

        sni = new MyLineEdit(EditQUIC);
        sni->setObjectName(QString::fromUtf8("sni"));

        TLS->addWidget(sni, 0, 1, 1, 1);

        alpn_l = new QLabel(EditQUIC);
        alpn_l->setObjectName(QString::fromUtf8("alpn_l"));
        alpn_l->setText(QString::fromUtf8("ALPN"));

        TLS->addWidget(alpn_l, 1, 0, 1, 1);

        sni_l = new QLabel(EditQUIC);
        sni_l->setObjectName(QString::fromUtf8("sni_l"));

        TLS->addWidget(sni_l, 0, 0, 1, 1);

        allowInsecure = new QCheckBox(EditQUIC);
        allowInsecure->setObjectName(QString::fromUtf8("allowInsecure"));

        TLS->addWidget(allowInsecure, 2, 2, 1, 1);

        alpn_sp = new QSpacerItem(40, 20, QSizePolicy::Maximum, QSizePolicy::Minimum);

        TLS->addItem(alpn_sp, 1, 2, 1, 1);


        verticalLayout->addLayout(TLS);

        flowControlWindow = new QHBoxLayout();
        flowControlWindow->setObjectName(QString::fromUtf8("flowControlWindow"));
        streamReceiveWindow_l = new QLabel(EditQUIC);
        streamReceiveWindow_l->setObjectName(QString::fromUtf8("streamReceiveWindow_l"));
        streamReceiveWindow_l->setText(QString::fromUtf8("recv_window"));

        flowControlWindow->addWidget(streamReceiveWindow_l);

        streamReceiveWindow = new MyLineEdit(EditQUIC);
        streamReceiveWindow->setObjectName(QString::fromUtf8("streamReceiveWindow"));

        flowControlWindow->addWidget(streamReceiveWindow);

        connectionReceiveWindow_l = new QLabel(EditQUIC);
        connectionReceiveWindow_l->setObjectName(QString::fromUtf8("connectionReceiveWindow_l"));
        connectionReceiveWindow_l->setText(QString::fromUtf8("recv_window_conn"));

        flowControlWindow->addWidget(connectionReceiveWindow_l);

        connectionReceiveWindow = new MyLineEdit(EditQUIC);
        connectionReceiveWindow->setObjectName(QString::fromUtf8("connectionReceiveWindow"));

        flowControlWindow->addWidget(connectionReceiveWindow);


        verticalLayout->addLayout(flowControlWindow);

        QWidget::setTabOrder(hopPort, hopInterval);
        QWidget::setTabOrder(hopInterval, uploadMbps);
        QWidget::setTabOrder(uploadMbps, downloadMbps);
        QWidget::setTabOrder(downloadMbps, congestionControl);
        QWidget::setTabOrder(congestionControl, udpRelayMode);
        QWidget::setTabOrder(udpRelayMode, heartbeat);
        QWidget::setTabOrder(heartbeat, zeroRttHandshake);
        QWidget::setTabOrder(zeroRttHandshake, forceExternal);
        QWidget::setTabOrder(forceExternal, uos);
        QWidget::setTabOrder(uos, disableMtuDiscovery);
        QWidget::setTabOrder(disableMtuDiscovery, obfsPassword);
        QWidget::setTabOrder(obfsPassword, uuid);
        QWidget::setTabOrder(uuid, uuidgen);
        QWidget::setTabOrder(uuidgen, password);
        QWidget::setTabOrder(password, sni);
        QWidget::setTabOrder(sni, disableSni);
        QWidget::setTabOrder(disableSni, alpn);
        QWidget::setTabOrder(alpn, certificate);
        QWidget::setTabOrder(certificate, allowInsecure);
        QWidget::setTabOrder(allowInsecure, streamReceiveWindow);
        QWidget::setTabOrder(streamReceiveWindow, connectionReceiveWindow);

        retranslateUi(EditQUIC);

        QMetaObject::connectSlotsByName(EditQUIC);
    } // setupUi

    void retranslateUi(QWidget *EditQUIC)
    {
        downloadMbps_l->setText(QCoreApplication::translate("EditQUIC", "Download (Mbps)", nullptr));
        hopPort_l->setText(QCoreApplication::translate("EditQUIC", "Hop Port", nullptr));
        hopInterval_l->setText(QCoreApplication::translate("EditQUIC", "Hop Interval (s)", nullptr));
        heartbeat_l->setText(QCoreApplication::translate("EditQUIC", "Heartbeat", nullptr));
        uploadMbps_l->setText(QCoreApplication::translate("EditQUIC", "Upload (Mbps)", nullptr));
        zeroRttHandshake->setText(QCoreApplication::translate("EditQUIC", "Zero Rtt Handshake", nullptr));
        congestionControl_l->setText(QCoreApplication::translate("EditQUIC", "Congestion Control", nullptr));

        udpRelayMode_l->setText(QCoreApplication::translate("EditQUIC", "UDP Relay Mode", nullptr));

        forceExternal->setText(QCoreApplication::translate("EditQUIC", "Force use external core", nullptr));
        disableMtuDiscovery->setText(QCoreApplication::translate("EditQUIC", "Disable MTU Discovery", nullptr));
        obfsPassword_l->setText(QCoreApplication::translate("EditQUIC", "Obfs Password", nullptr));
        uuidgen->setText(QCoreApplication::translate("EditQUIC", "Generate UUID", nullptr));
        password_l->setText(QCoreApplication::translate("EditQUIC", "Password", nullptr));
        certificate_l->setText(QCoreApplication::translate("EditQUIC", "Certificate", nullptr));
        disableSni->setText(QCoreApplication::translate("EditQUIC", "Disable SNI", nullptr));
        sni_l->setText(QCoreApplication::translate("EditQUIC", "SNI", nullptr));
        allowInsecure->setText(QCoreApplication::translate("EditQUIC", "Allow Insecure", nullptr));
        (void)EditQUIC;
    } // retranslateUi

};

namespace Ui {
    class EditQUIC: public Ui_EditQUIC {};
} // namespace Ui

QT_END_NAMESPACE

#endif // UI_EDIT_QUIC_H

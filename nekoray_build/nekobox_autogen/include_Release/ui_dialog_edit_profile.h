/********************************************************************************
** Form generated from reading UI file 'dialog_edit_profile.ui'
**
** Created by: Qt User Interface Compiler version 5.15.2
**
** WARNING! All changes made in this file will be lost when recompiling UI file!
********************************************************************************/

#ifndef UI_DIALOG_EDIT_PROFILE_H
#define UI_DIALOG_EDIT_PROFILE_H

#include <QtCore/QVariant>
#include <QtWidgets/QApplication>
#include <QtWidgets/QCheckBox>
#include <QtWidgets/QComboBox>
#include <QtWidgets/QDialog>
#include <QtWidgets/QDialogButtonBox>
#include <QtWidgets/QFrame>
#include <QtWidgets/QGridLayout>
#include <QtWidgets/QGroupBox>
#include <QtWidgets/QHBoxLayout>
#include <QtWidgets/QLabel>
#include <QtWidgets/QLineEdit>
#include <QtWidgets/QPushButton>
#include <QtWidgets/QVBoxLayout>
#include <QtWidgets/QWidget>
#include "ui/widget/MyLineEdit.h"

QT_BEGIN_NAMESPACE

class Ui_DialogEditProfile
{
public:
    QHBoxLayout *dialog_layout;
    QWidget *left_w;
    QVBoxLayout *left;
    QGroupBox *groupBox;
    QVBoxLayout *verticalLayout_3;
    QGridLayout *gridLayout_2;
    MyLineEdit *address;
    MyLineEdit *name;
    QLineEdit *port;
    QLabel *type_l;
    QLabel *port_l;
    QLabel *address_l;
    QLabel *label;
    QComboBox *type;
    QGroupBox *bean;
    QVBoxLayout *verticalLayout_4;
    QWidget *fake;
    QHBoxLayout *horizontalLayout_2;
    QGroupBox *custom_box;
    QVBoxLayout *verticalLayout_5;
    QPushButton *custom_outbound_edit;
    QGroupBox *custom_global_box;
    QHBoxLayout *horizontalLayout_3;
    QPushButton *custom_config_edit;
    QHBoxLayout *horizontalLayout_4;
    QPushButton *apply_to_group;
    QDialogButtonBox *buttonBox;
    QWidget *right_all_w;
    QVBoxLayout *right_layout;
    QGroupBox *stream_box;
    QVBoxLayout *verticalLayout;
    QGridLayout *_2;
    QComboBox *network;
    QComboBox *packet_encoding;
    QLabel *network_l;
    QComboBox *security;
    QLabel *security_l;
    QLabel *packet_encoding_l;
    QLabel *multiplex_l;
    QComboBox *multiplex;
    QGroupBox *network_box;
    QGridLayout *gridLayout;
    QLabel *path_l;
    MyLineEdit *host;
    QLabel *host_l;
    QLabel *header_type_l;
    MyLineEdit *path;
    QComboBox *header_type;
    MyLineEdit *ws_early_data_length;
    QLabel *ws_early_data_length_l;
    MyLineEdit *ws_early_data_name;
    QLabel *ws_early_data_name_l;
    QGroupBox *security_box;
    QVBoxLayout *verticalLayout_2;
    QHBoxLayout *horizontalLayout;
    QCheckBox *insecure;
    QFrame *line;
    QLabel *label_6;
    QPushButton *certificate_edit;
    QGridLayout *_3;
    MyLineEdit *sni;
    QLabel *label_5;
    QLabel *label_8;
    MyLineEdit *alpn;
    QGroupBox *tls_camouflage_box;
    QGridLayout *gridLayout_3;
    QComboBox *utlsFingerprint;
    QLabel *label_2;
    QLabel *reality_pbk_l;
    QLabel *reality_sid_l;
    MyLineEdit *reality_sid;
    MyLineEdit *reality_pbk;
    QLabel *reality_spx_l;
    MyLineEdit *reality_spx;

    void setupUi(QDialog *DialogEditProfile)
    {
        if (DialogEditProfile->objectName().isEmpty())
            DialogEditProfile->setObjectName(QString::fromUtf8("DialogEditProfile"));
        DialogEditProfile->resize(1000, 802);
        QSizePolicy sizePolicy(QSizePolicy::Preferred, QSizePolicy::Preferred);
        sizePolicy.setHorizontalStretch(0);
        sizePolicy.setVerticalStretch(0);
        sizePolicy.setHeightForWidth(DialogEditProfile->sizePolicy().hasHeightForWidth());
        DialogEditProfile->setSizePolicy(sizePolicy);
        dialog_layout = new QHBoxLayout(DialogEditProfile);
        dialog_layout->setObjectName(QString::fromUtf8("dialog_layout"));
        left_w = new QWidget(DialogEditProfile);
        left_w->setObjectName(QString::fromUtf8("left_w"));
        QSizePolicy sizePolicy1(QSizePolicy::Minimum, QSizePolicy::Maximum);
        sizePolicy1.setHorizontalStretch(0);
        sizePolicy1.setVerticalStretch(0);
        sizePolicy1.setHeightForWidth(left_w->sizePolicy().hasHeightForWidth());
        left_w->setSizePolicy(sizePolicy1);
        left_w->setMinimumSize(QSize(400, 0));
        left = new QVBoxLayout(left_w);
        left->setObjectName(QString::fromUtf8("left"));
        left->setSizeConstraint(QLayout::SetDefaultConstraint);
        groupBox = new QGroupBox(left_w);
        groupBox->setObjectName(QString::fromUtf8("groupBox"));
        QSizePolicy sizePolicy2(QSizePolicy::Preferred, QSizePolicy::Maximum);
        sizePolicy2.setHorizontalStretch(0);
        sizePolicy2.setVerticalStretch(0);
        sizePolicy2.setHeightForWidth(groupBox->sizePolicy().hasHeightForWidth());
        groupBox->setSizePolicy(sizePolicy2);
        verticalLayout_3 = new QVBoxLayout(groupBox);
        verticalLayout_3->setObjectName(QString::fromUtf8("verticalLayout_3"));
        gridLayout_2 = new QGridLayout();
        gridLayout_2->setObjectName(QString::fromUtf8("gridLayout_2"));
        address = new MyLineEdit(groupBox);
        address->setObjectName(QString::fromUtf8("address"));

        gridLayout_2->addWidget(address, 2, 1, 1, 1);

        name = new MyLineEdit(groupBox);
        name->setObjectName(QString::fromUtf8("name"));

        gridLayout_2->addWidget(name, 1, 1, 1, 1);

        port = new QLineEdit(groupBox);
        port->setObjectName(QString::fromUtf8("port"));

        gridLayout_2->addWidget(port, 3, 1, 1, 1);

        type_l = new QLabel(groupBox);
        type_l->setObjectName(QString::fromUtf8("type_l"));

        gridLayout_2->addWidget(type_l, 0, 0, 1, 1);

        port_l = new QLabel(groupBox);
        port_l->setObjectName(QString::fromUtf8("port_l"));

        gridLayout_2->addWidget(port_l, 3, 0, 1, 1);

        address_l = new QLabel(groupBox);
        address_l->setObjectName(QString::fromUtf8("address_l"));

        gridLayout_2->addWidget(address_l, 2, 0, 1, 1);

        label = new QLabel(groupBox);
        label->setObjectName(QString::fromUtf8("label"));

        gridLayout_2->addWidget(label, 1, 0, 1, 1);

        type = new QComboBox(groupBox);
        type->setObjectName(QString::fromUtf8("type"));

        gridLayout_2->addWidget(type, 0, 1, 1, 1);


        verticalLayout_3->addLayout(gridLayout_2);


        left->addWidget(groupBox);

        bean = new QGroupBox(left_w);
        bean->setObjectName(QString::fromUtf8("bean"));
        sizePolicy2.setHeightForWidth(bean->sizePolicy().hasHeightForWidth());
        bean->setSizePolicy(sizePolicy2);
        bean->setTitle(QString::fromUtf8("Bean"));
        verticalLayout_4 = new QVBoxLayout(bean);
        verticalLayout_4->setObjectName(QString::fromUtf8("verticalLayout_4"));
        fake = new QWidget(bean);
        fake->setObjectName(QString::fromUtf8("fake"));

        verticalLayout_4->addWidget(fake);


        left->addWidget(bean);

        horizontalLayout_2 = new QHBoxLayout();
        horizontalLayout_2->setObjectName(QString::fromUtf8("horizontalLayout_2"));
        custom_box = new QGroupBox(left_w);
        custom_box->setObjectName(QString::fromUtf8("custom_box"));
        sizePolicy2.setHeightForWidth(custom_box->sizePolicy().hasHeightForWidth());
        custom_box->setSizePolicy(sizePolicy2);
        verticalLayout_5 = new QVBoxLayout(custom_box);
        verticalLayout_5->setObjectName(QString::fromUtf8("verticalLayout_5"));
        custom_outbound_edit = new QPushButton(custom_box);
        custom_outbound_edit->setObjectName(QString::fromUtf8("custom_outbound_edit"));
        custom_outbound_edit->setText(QString::fromUtf8("Edit"));

        verticalLayout_5->addWidget(custom_outbound_edit);


        horizontalLayout_2->addWidget(custom_box);

        custom_global_box = new QGroupBox(left_w);
        custom_global_box->setObjectName(QString::fromUtf8("custom_global_box"));
        horizontalLayout_3 = new QHBoxLayout(custom_global_box);
        horizontalLayout_3->setObjectName(QString::fromUtf8("horizontalLayout_3"));
        custom_config_edit = new QPushButton(custom_global_box);
        custom_config_edit->setObjectName(QString::fromUtf8("custom_config_edit"));
        custom_config_edit->setText(QString::fromUtf8("Edit"));

        horizontalLayout_3->addWidget(custom_config_edit);


        horizontalLayout_2->addWidget(custom_global_box);


        left->addLayout(horizontalLayout_2);

        horizontalLayout_4 = new QHBoxLayout();
        horizontalLayout_4->setObjectName(QString::fromUtf8("horizontalLayout_4"));
        apply_to_group = new QPushButton(left_w);
        apply_to_group->setObjectName(QString::fromUtf8("apply_to_group"));

        horizontalLayout_4->addWidget(apply_to_group);

        buttonBox = new QDialogButtonBox(left_w);
        buttonBox->setObjectName(QString::fromUtf8("buttonBox"));
        QSizePolicy sizePolicy3(QSizePolicy::Expanding, QSizePolicy::Fixed);
        sizePolicy3.setHorizontalStretch(0);
        sizePolicy3.setVerticalStretch(0);
        sizePolicy3.setHeightForWidth(buttonBox->sizePolicy().hasHeightForWidth());
        buttonBox->setSizePolicy(sizePolicy3);
        buttonBox->setOrientation(Qt::Horizontal);
        buttonBox->setStandardButtons(QDialogButtonBox::Cancel|QDialogButtonBox::Ok);

        horizontalLayout_4->addWidget(buttonBox);


        left->addLayout(horizontalLayout_4);


        dialog_layout->addWidget(left_w);

        right_all_w = new QWidget(DialogEditProfile);
        right_all_w->setObjectName(QString::fromUtf8("right_all_w"));
        sizePolicy2.setHeightForWidth(right_all_w->sizePolicy().hasHeightForWidth());
        right_all_w->setSizePolicy(sizePolicy2);
        right_all_w->setMinimumSize(QSize(400, 0));
        right_layout = new QVBoxLayout(right_all_w);
        right_layout->setObjectName(QString::fromUtf8("right_layout"));
        right_layout->setSizeConstraint(QLayout::SetDefaultConstraint);
        stream_box = new QGroupBox(right_all_w);
        stream_box->setObjectName(QString::fromUtf8("stream_box"));
        sizePolicy2.setHeightForWidth(stream_box->sizePolicy().hasHeightForWidth());
        stream_box->setSizePolicy(sizePolicy2);
        verticalLayout = new QVBoxLayout(stream_box);
        verticalLayout->setObjectName(QString::fromUtf8("verticalLayout"));
        _2 = new QGridLayout();
        _2->setObjectName(QString::fromUtf8("_2"));
        network = new QComboBox(stream_box);
        network->addItem(QString::fromUtf8(""));
        network->addItem(QString::fromUtf8("tcp"));
        network->addItem(QString::fromUtf8("ws"));
        network->addItem(QString::fromUtf8("httpupgrade"));
        network->addItem(QString::fromUtf8("http"));
        network->addItem(QString::fromUtf8("grpc"));
        network->addItem(QString::fromUtf8("quic"));
        network->setObjectName(QString::fromUtf8("network"));
        sizePolicy3.setHeightForWidth(network->sizePolicy().hasHeightForWidth());
        network->setSizePolicy(sizePolicy3);

        _2->addWidget(network, 0, 1, 1, 1);

        packet_encoding = new QComboBox(stream_box);
        packet_encoding->addItem(QString::fromUtf8(""));
        packet_encoding->addItem(QString::fromUtf8("packetaddr"));
        packet_encoding->addItem(QString::fromUtf8("xudp"));
        packet_encoding->setObjectName(QString::fromUtf8("packet_encoding"));

        _2->addWidget(packet_encoding, 2, 1, 1, 1);

        network_l = new QLabel(stream_box);
        network_l->setObjectName(QString::fromUtf8("network_l"));

        _2->addWidget(network_l, 0, 0, 1, 1);

        security = new QComboBox(stream_box);
        security->addItem(QString::fromUtf8(""));
        security->addItem(QString::fromUtf8("tls"));
        security->setObjectName(QString::fromUtf8("security"));

        _2->addWidget(security, 1, 1, 1, 1);

        security_l = new QLabel(stream_box);
        security_l->setObjectName(QString::fromUtf8("security_l"));

        _2->addWidget(security_l, 1, 0, 1, 1);

        packet_encoding_l = new QLabel(stream_box);
        packet_encoding_l->setObjectName(QString::fromUtf8("packet_encoding_l"));

        _2->addWidget(packet_encoding_l, 2, 0, 1, 1);

        multiplex_l = new QLabel(stream_box);
        multiplex_l->setObjectName(QString::fromUtf8("multiplex_l"));

        _2->addWidget(multiplex_l, 3, 0, 1, 1);

        multiplex = new QComboBox(stream_box);
        multiplex->addItem(QString());
        multiplex->addItem(QString());
        multiplex->addItem(QString());
        multiplex->setObjectName(QString::fromUtf8("multiplex"));

        _2->addWidget(multiplex, 3, 1, 1, 1);


        verticalLayout->addLayout(_2);


        right_layout->addWidget(stream_box);

        network_box = new QGroupBox(right_all_w);
        network_box->setObjectName(QString::fromUtf8("network_box"));
        sizePolicy2.setHeightForWidth(network_box->sizePolicy().hasHeightForWidth());
        network_box->setSizePolicy(sizePolicy2);
        gridLayout = new QGridLayout(network_box);
        gridLayout->setObjectName(QString::fromUtf8("gridLayout"));
        path_l = new QLabel(network_box);
        path_l->setObjectName(QString::fromUtf8("path_l"));
#if QT_CONFIG(tooltip)
        path_l->setToolTip(QString::fromUtf8("http path (ws/http/\344\274\252\350\243\205http)\n"
"serviceName (gRPC)\n"
"key (QUIC)"));
#endif // QT_CONFIG(tooltip)
        path_l->setText(QString::fromUtf8("Path"));

        gridLayout->addWidget(path_l, 1, 0, 1, 1);

        host = new MyLineEdit(network_box);
        host->setObjectName(QString::fromUtf8("host"));

        gridLayout->addWidget(host, 2, 1, 1, 1);

        host_l = new QLabel(network_box);
        host_l->setObjectName(QString::fromUtf8("host_l"));
#if QT_CONFIG(tooltip)
        host_l->setToolTip(QString::fromUtf8("http host (ws/http/\344\274\252\350\243\205http)\n"
"security (QUIC)"));
#endif // QT_CONFIG(tooltip)
        host_l->setText(QString::fromUtf8("Host"));

        gridLayout->addWidget(host_l, 2, 0, 1, 1);

        header_type_l = new QLabel(network_box);
        header_type_l->setObjectName(QString::fromUtf8("header_type_l"));
        QSizePolicy sizePolicy4(QSizePolicy::Maximum, QSizePolicy::Preferred);
        sizePolicy4.setHorizontalStretch(0);
        sizePolicy4.setVerticalStretch(0);
        sizePolicy4.setHeightForWidth(header_type_l->sizePolicy().hasHeightForWidth());
        header_type_l->setSizePolicy(sizePolicy4);
#if QT_CONFIG(tooltip)
        header_type_l->setToolTip(QString::fromUtf8("\344\274\252\350\243\205\345\244\264\351\203\250\347\261\273\345\236\213 (tcp/quic)"));
#endif // QT_CONFIG(tooltip)
        header_type_l->setText(QString::fromUtf8("header"));

        gridLayout->addWidget(header_type_l, 0, 0, 1, 1);

        path = new MyLineEdit(network_box);
        path->setObjectName(QString::fromUtf8("path"));

        gridLayout->addWidget(path, 1, 1, 1, 1);

        header_type = new QComboBox(network_box);
        header_type->addItem(QString::fromUtf8(""));
        header_type->addItem(QString::fromUtf8("http"));
        header_type->setObjectName(QString::fromUtf8("header_type"));
        QSizePolicy sizePolicy5(QSizePolicy::Minimum, QSizePolicy::Fixed);
        sizePolicy5.setHorizontalStretch(0);
        sizePolicy5.setVerticalStretch(0);
        sizePolicy5.setHeightForWidth(header_type->sizePolicy().hasHeightForWidth());
        header_type->setSizePolicy(sizePolicy5);
        header_type->setEditable(true);

        gridLayout->addWidget(header_type, 0, 1, 1, 1);

        ws_early_data_length = new MyLineEdit(network_box);
        ws_early_data_length->setObjectName(QString::fromUtf8("ws_early_data_length"));

        gridLayout->addWidget(ws_early_data_length, 3, 1, 1, 1);

        ws_early_data_length_l = new QLabel(network_box);
        ws_early_data_length_l->setObjectName(QString::fromUtf8("ws_early_data_length_l"));
        ws_early_data_length_l->setText(QString::fromUtf8("EarlyData Length"));

        gridLayout->addWidget(ws_early_data_length_l, 3, 0, 1, 1);

        ws_early_data_name = new MyLineEdit(network_box);
        ws_early_data_name->setObjectName(QString::fromUtf8("ws_early_data_name"));

        gridLayout->addWidget(ws_early_data_name, 4, 1, 1, 1);

        ws_early_data_name_l = new QLabel(network_box);
        ws_early_data_name_l->setObjectName(QString::fromUtf8("ws_early_data_name_l"));
        ws_early_data_name_l->setText(QString::fromUtf8("EarlyData Name"));

        gridLayout->addWidget(ws_early_data_name_l, 4, 0, 1, 1);


        right_layout->addWidget(network_box);

        security_box = new QGroupBox(right_all_w);
        security_box->setObjectName(QString::fromUtf8("security_box"));
        sizePolicy2.setHeightForWidth(security_box->sizePolicy().hasHeightForWidth());
        security_box->setSizePolicy(sizePolicy2);
        verticalLayout_2 = new QVBoxLayout(security_box);
        verticalLayout_2->setObjectName(QString::fromUtf8("verticalLayout_2"));
        horizontalLayout = new QHBoxLayout();
        horizontalLayout->setObjectName(QString::fromUtf8("horizontalLayout"));
        insecure = new QCheckBox(security_box);
        insecure->setObjectName(QString::fromUtf8("insecure"));
        QSizePolicy sizePolicy6(QSizePolicy::Maximum, QSizePolicy::Fixed);
        sizePolicy6.setHorizontalStretch(0);
        sizePolicy6.setVerticalStretch(0);
        sizePolicy6.setHeightForWidth(insecure->sizePolicy().hasHeightForWidth());
        insecure->setSizePolicy(sizePolicy6);

        horizontalLayout->addWidget(insecure);

        line = new QFrame(security_box);
        line->setObjectName(QString::fromUtf8("line"));
        line->setFrameShape(QFrame::VLine);
        line->setFrameShadow(QFrame::Sunken);

        horizontalLayout->addWidget(line);

        label_6 = new QLabel(security_box);
        label_6->setObjectName(QString::fromUtf8("label_6"));
        sizePolicy4.setHeightForWidth(label_6->sizePolicy().hasHeightForWidth());
        label_6->setSizePolicy(sizePolicy4);
#if QT_CONFIG(tooltip)
        label_6->setToolTip(QString::fromUtf8(""));
#endif // QT_CONFIG(tooltip)

        horizontalLayout->addWidget(label_6);

        certificate_edit = new QPushButton(security_box);
        certificate_edit->setObjectName(QString::fromUtf8("certificate_edit"));
        certificate_edit->setText(QString::fromUtf8("Edit"));

        horizontalLayout->addWidget(certificate_edit);


        verticalLayout_2->addLayout(horizontalLayout);

        _3 = new QGridLayout();
        _3->setObjectName(QString::fromUtf8("_3"));
        sni = new MyLineEdit(security_box);
        sni->setObjectName(QString::fromUtf8("sni"));

        _3->addWidget(sni, 0, 1, 1, 1);

        label_5 = new QLabel(security_box);
        label_5->setObjectName(QString::fromUtf8("label_5"));
        label_5->setText(QString::fromUtf8("SNI"));

        _3->addWidget(label_5, 0, 0, 1, 1);

        label_8 = new QLabel(security_box);
        label_8->setObjectName(QString::fromUtf8("label_8"));
        label_8->setText(QString::fromUtf8("ALPN"));

        _3->addWidget(label_8, 1, 0, 1, 1);

        alpn = new MyLineEdit(security_box);
        alpn->setObjectName(QString::fromUtf8("alpn"));

        _3->addWidget(alpn, 1, 1, 1, 1);


        verticalLayout_2->addLayout(_3);


        right_layout->addWidget(security_box);

        tls_camouflage_box = new QGroupBox(right_all_w);
        tls_camouflage_box->setObjectName(QString::fromUtf8("tls_camouflage_box"));
        gridLayout_3 = new QGridLayout(tls_camouflage_box);
        gridLayout_3->setObjectName(QString::fromUtf8("gridLayout_3"));
        utlsFingerprint = new QComboBox(tls_camouflage_box);
        utlsFingerprint->setObjectName(QString::fromUtf8("utlsFingerprint"));
        utlsFingerprint->setEditable(true);

        gridLayout_3->addWidget(utlsFingerprint, 0, 1, 1, 1);

        label_2 = new QLabel(tls_camouflage_box);
        label_2->setObjectName(QString::fromUtf8("label_2"));
        sizePolicy4.setHeightForWidth(label_2->sizePolicy().hasHeightForWidth());
        label_2->setSizePolicy(sizePolicy4);
        label_2->setText(QString::fromUtf8("Fingerprint"));

        gridLayout_3->addWidget(label_2, 0, 0, 1, 1);

        reality_pbk_l = new QLabel(tls_camouflage_box);
        reality_pbk_l->setObjectName(QString::fromUtf8("reality_pbk_l"));
        reality_pbk_l->setText(QString::fromUtf8("Reality Pbk"));

        gridLayout_3->addWidget(reality_pbk_l, 1, 0, 1, 1);

        reality_sid_l = new QLabel(tls_camouflage_box);
        reality_sid_l->setObjectName(QString::fromUtf8("reality_sid_l"));
        reality_sid_l->setText(QString::fromUtf8("Reality Sid"));

        gridLayout_3->addWidget(reality_sid_l, 2, 0, 1, 1);

        reality_sid = new MyLineEdit(tls_camouflage_box);
        reality_sid->setObjectName(QString::fromUtf8("reality_sid"));

        gridLayout_3->addWidget(reality_sid, 2, 1, 1, 1);

        reality_pbk = new MyLineEdit(tls_camouflage_box);
        reality_pbk->setObjectName(QString::fromUtf8("reality_pbk"));

        gridLayout_3->addWidget(reality_pbk, 1, 1, 1, 1);

        reality_spx_l = new QLabel(tls_camouflage_box);
        reality_spx_l->setObjectName(QString::fromUtf8("reality_spx_l"));
#if QT_CONFIG(tooltip)
        reality_spx_l->setToolTip(QString::fromUtf8(""));
#endif // QT_CONFIG(tooltip)
        reality_spx_l->setText(QString::fromUtf8("SpiderX"));

        gridLayout_3->addWidget(reality_spx_l, 3, 0, 1, 1);

        reality_spx = new MyLineEdit(tls_camouflage_box);
        reality_spx->setObjectName(QString::fromUtf8("reality_spx"));

        gridLayout_3->addWidget(reality_spx, 3, 1, 1, 1);


        right_layout->addWidget(tls_camouflage_box);


        dialog_layout->addWidget(right_all_w);

        QWidget::setTabOrder(type, name);
        QWidget::setTabOrder(name, address);
        QWidget::setTabOrder(address, port);
        QWidget::setTabOrder(port, custom_outbound_edit);
        QWidget::setTabOrder(custom_outbound_edit, custom_config_edit);
        QWidget::setTabOrder(custom_config_edit, apply_to_group);
        QWidget::setTabOrder(apply_to_group, network);
        QWidget::setTabOrder(network, security);
        QWidget::setTabOrder(security, packet_encoding);
        QWidget::setTabOrder(packet_encoding, multiplex);
        QWidget::setTabOrder(multiplex, header_type);
        QWidget::setTabOrder(header_type, path);
        QWidget::setTabOrder(path, host);
        QWidget::setTabOrder(host, ws_early_data_length);
        QWidget::setTabOrder(ws_early_data_length, ws_early_data_name);
        QWidget::setTabOrder(ws_early_data_name, insecure);
        QWidget::setTabOrder(insecure, certificate_edit);
        QWidget::setTabOrder(certificate_edit, sni);
        QWidget::setTabOrder(sni, alpn);
        QWidget::setTabOrder(alpn, utlsFingerprint);
        QWidget::setTabOrder(utlsFingerprint, reality_pbk);
        QWidget::setTabOrder(reality_pbk, reality_sid);

        retranslateUi(DialogEditProfile);
        QObject::connect(buttonBox, SIGNAL(accepted()), DialogEditProfile, SLOT(accept()));
        QObject::connect(buttonBox, SIGNAL(rejected()), DialogEditProfile, SLOT(reject()));

        QMetaObject::connectSlotsByName(DialogEditProfile);
    } // setupUi

    void retranslateUi(QDialog *DialogEditProfile)
    {
        DialogEditProfile->setWindowTitle(QCoreApplication::translate("DialogEditProfile", "Edit", nullptr));
        groupBox->setTitle(QCoreApplication::translate("DialogEditProfile", "Common", nullptr));
        type_l->setText(QCoreApplication::translate("DialogEditProfile", "Type", nullptr));
        port_l->setText(QCoreApplication::translate("DialogEditProfile", "Port", nullptr));
        address_l->setText(QCoreApplication::translate("DialogEditProfile", "Address", nullptr));
        label->setText(QCoreApplication::translate("DialogEditProfile", "Name", nullptr));
        custom_box->setTitle(QCoreApplication::translate("DialogEditProfile", "Custom Outbound Settings", nullptr));
        custom_global_box->setTitle(QCoreApplication::translate("DialogEditProfile", "Custom Config Settings", nullptr));
        apply_to_group->setText(QCoreApplication::translate("DialogEditProfile", "Apply settings to this group", nullptr));
#if QT_CONFIG(tooltip)
        right_all_w->setToolTip(QString());
#endif // QT_CONFIG(tooltip)
        stream_box->setTitle(QCoreApplication::translate("DialogEditProfile", "Settings", nullptr));


#if QT_CONFIG(tooltip)
        network_l->setToolTip(QCoreApplication::translate("DialogEditProfile", "The underlying transport method. It must be consistent with the server, otherwise, the connection cannot be established.", nullptr));
#endif // QT_CONFIG(tooltip)
        network_l->setText(QCoreApplication::translate("DialogEditProfile", "Network", nullptr));

#if QT_CONFIG(tooltip)
        security_l->setToolTip(QCoreApplication::translate("DialogEditProfile", "Transport Layer Security. It must be consistent with the server, otherwise, the connection cannot be established.", nullptr));
#endif // QT_CONFIG(tooltip)
        security_l->setText(QCoreApplication::translate("DialogEditProfile", "Security", nullptr));
#if QT_CONFIG(tooltip)
        packet_encoding_l->setToolTip(QCoreApplication::translate("DialogEditProfile", "UDP FullCone Packet encoding for implementing features such as UDP FullCone. Server support is required, if the wrong selection is made, the connection cannot be made. Please leave it blank.", nullptr));
#endif // QT_CONFIG(tooltip)
        packet_encoding_l->setText(QCoreApplication::translate("DialogEditProfile", "Packet Encoding", nullptr));
#if QT_CONFIG(tooltip)
        multiplex_l->setToolTip(QCoreApplication::translate("DialogEditProfile", "Server support is required", nullptr));
#endif // QT_CONFIG(tooltip)
        multiplex_l->setText(QCoreApplication::translate("DialogEditProfile", "Multiplex", nullptr));
        multiplex->setItemText(0, QCoreApplication::translate("DialogEditProfile", "Keep Default", nullptr));
        multiplex->setItemText(1, QCoreApplication::translate("DialogEditProfile", "On", nullptr));
        multiplex->setItemText(2, QCoreApplication::translate("DialogEditProfile", "Off", nullptr));

        network_box->setTitle(QCoreApplication::translate("DialogEditProfile", "Network Settings (%1)", nullptr));

        security_box->setTitle(QCoreApplication::translate("DialogEditProfile", "TLS Security Settings", nullptr));
#if QT_CONFIG(tooltip)
        insecure->setToolTip(QCoreApplication::translate("DialogEditProfile", "When enabled, V2Ray will not check the validity of the TLS certificate provided by the remote host (the security is equivalent to plaintext)", nullptr));
#endif // QT_CONFIG(tooltip)
        insecure->setText(QCoreApplication::translate("DialogEditProfile", "Allow insecure", nullptr));
        label_6->setText(QCoreApplication::translate("DialogEditProfile", "Certificate", nullptr));
#if QT_CONFIG(tooltip)
        label_5->setToolTip(QCoreApplication::translate("DialogEditProfile", "Server name indication, clear text.", nullptr));
#endif // QT_CONFIG(tooltip)
#if QT_CONFIG(tooltip)
        label_8->setToolTip(QCoreApplication::translate("DialogEditProfile", "Application layer protocol negotiation, clear text. Please separate them with commas.", nullptr));
#endif // QT_CONFIG(tooltip)
        tls_camouflage_box->setTitle(QCoreApplication::translate("DialogEditProfile", "TLS Camouflage Settings", nullptr));
#if QT_CONFIG(tooltip)
        reality_pbk_l->setToolTip(QCoreApplication::translate("DialogEditProfile", "Reality public key. If not empty, turn TLS into REALITY.", nullptr));
#endif // QT_CONFIG(tooltip)
#if QT_CONFIG(tooltip)
        reality_sid_l->setToolTip(QCoreApplication::translate("DialogEditProfile", "Reality short id. Accept only one value.", nullptr));
#endif // QT_CONFIG(tooltip)
    } // retranslateUi

};

namespace Ui {
    class DialogEditProfile: public Ui_DialogEditProfile {};
} // namespace Ui

QT_END_NAMESPACE

#endif // UI_DIALOG_EDIT_PROFILE_H

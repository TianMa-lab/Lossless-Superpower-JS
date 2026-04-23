/********************************************************************************
** Form generated from reading UI file 'dialog_basic_settings.ui'
**
** Created by: Qt User Interface Compiler version 5.15.2
**
** WARNING! All changes made in this file will be lost when recompiling UI file!
********************************************************************************/

#ifndef UI_DIALOG_BASIC_SETTINGS_H
#define UI_DIALOG_BASIC_SETTINGS_H

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
#include <QtWidgets/QScrollArea>
#include <QtWidgets/QTabWidget>
#include <QtWidgets/QVBoxLayout>
#include <QtWidgets/QWidget>
#include "ui/widget/MyLineEdit.h"

QT_BEGIN_NAMESPACE

class Ui_DialogBasicSettings
{
public:
    QGridLayout *gridLayout;
    QDialogButtonBox *buttonBox;
    QTabWidget *tabWidget;
    QWidget *tab_1;
    QVBoxLayout *verticalLayout_2;
    QHBoxLayout *hlayout_l1;
    QGroupBox *horizontalGroupBox_3;
    QHBoxLayout *horizontalLayout_19;
    QLabel *label;
    QLineEdit *inbound_address;
    QPushButton *inbound_auth;
    QGroupBox *groupbox_custom_inbound;
    QHBoxLayout *horizontalLayout_10;
    QLabel *label_11;
    QPushButton *custom_inbound_edit;
    QHBoxLayout *hlayout_l2;
    QGroupBox *horizontalGroupBox_2;
    QHBoxLayout *horizontalLayout_13;
    QLabel *inbound_socks_port_l;
    QLineEdit *inbound_socks_port;
    QGroupBox *groupBox1;
    QHBoxLayout *horizontalLayout_9;
    QLabel *label_13;
    QLineEdit *test_latency_url;
    QLabel *label_14;
    QLineEdit *test_concurrent;
    QGroupBox *horizontalGroupBox;
    QHBoxLayout *horizontalLayout_12;
    QLabel *label_19;
    MyLineEdit *test_download_url;
    QLabel *label_10;
    QLineEdit *test_download_timeout;
    QGroupBox *horizontalGroupBox1;
    QHBoxLayout *horizontalLayout_18;
    QCheckBox *check_include_pre;
    QFrame *sys_proxy_format_vline;
    QCheckBox *old_share_link_format;
    QPushButton *sys_proxy_format;
    QWidget *horizontalWidget_1;
    QHBoxLayout *horizontalLayout_2;
    QWidget *tab_2;
    QGridLayout *gridLayout_5;
    QHBoxLayout *style_h_1;
    QGroupBox *groupBox;
    QHBoxLayout *horizontalLayout_4;
    QLabel *label_8;
    QComboBox *theme;
    QPushButton *set_custom_icon;
    QGroupBox *groupBox2;
    QHBoxLayout *horizontalLayout_7;
    QLabel *label_15;
    QComboBox *language;
    QHBoxLayout *style_h_2;
    QGroupBox *traffic_statistics_box;
    QHBoxLayout *horizontalLayout_3;
    QLabel *label_16;
    QComboBox *rfsh_r;
    QGroupBox *connection_statistics_box;
    QHBoxLayout *horizontalLayout_15;
    QLabel *label_9;
    QCheckBox *connection_statistics;
    QHBoxLayout *style_h_3;
    QGroupBox *horizontalGroupBox_5;
    QHBoxLayout *horizontalLayout_6;
    QCheckBox *start_minimal;
    QGroupBox *groupBox_2;
    QHBoxLayout *horizontalLayout_23;
    QLabel *label_17;
    QLineEdit *max_log_line;
    QWidget *tab_3;
    QGridLayout *gridLayout_3;
    QHBoxLayout *horizontalLayout_5;
    QCheckBox *sub_auto_update_enable;
    QLabel *label_21;
    QLineEdit *sub_auto_update;
    MyLineEdit *user_agent;
    QCheckBox *sub_use_proxy;
    QCheckBox *sub_insecure;
    QCheckBox *sub_clear;
    QLabel *label_20;
    QLabel *label_4;
    QWidget *tab_4;
    QVBoxLayout *verticalLayout;
    QGroupBox *groupBox_core;
    QVBoxLayout *verticalLayout_3;
    QWidget *assest_group;
    QGridLayout *gridLayout_2;
    QComboBox *log_level;
    QLabel *label_6;
    QLabel *label_3;
    QHBoxLayout *horizontalLayout;
    QComboBox *mux_protocol;
    QLabel *label_7;
    QLineEdit *mux_concurrency;
    QCheckBox *mux_padding;
    QCheckBox *mux_default_on;
    QPushButton *core_settings;
    QWidget *tab_6;
    QVBoxLayout *verticalLayout_5;
    QScrollArea *extra_core_box_scrollArea;
    QWidget *extra_core_box_scrollAreaWidgetContents;
    QVBoxLayout *verticalLayout_6;
    QWidget *horizontalWidget_4;
    QHBoxLayout *horizontalLayout_8;
    QPushButton *extra_core_add;
    QPushButton *extra_core_del;
    QWidget *tab_5;
    QVBoxLayout *verticalLayout_4;
    QCheckBox *skip_cert;
    QGroupBox *horizontalGroupBox2;
    QHBoxLayout *horizontalLayout_26;
    QLabel *label_18;
    QComboBox *utlsFingerprint;

    void setupUi(QDialog *DialogBasicSettings)
    {
        if (DialogBasicSettings->objectName().isEmpty())
            DialogBasicSettings->setObjectName(QString::fromUtf8("DialogBasicSettings"));
        DialogBasicSettings->resize(600, 400);
        QSizePolicy sizePolicy(QSizePolicy::Preferred, QSizePolicy::Preferred);
        sizePolicy.setHorizontalStretch(0);
        sizePolicy.setVerticalStretch(0);
        sizePolicy.setHeightForWidth(DialogBasicSettings->sizePolicy().hasHeightForWidth());
        DialogBasicSettings->setSizePolicy(sizePolicy);
        gridLayout = new QGridLayout(DialogBasicSettings);
        gridLayout->setObjectName(QString::fromUtf8("gridLayout"));
        buttonBox = new QDialogButtonBox(DialogBasicSettings);
        buttonBox->setObjectName(QString::fromUtf8("buttonBox"));
        buttonBox->setOrientation(Qt::Horizontal);
        buttonBox->setStandardButtons(QDialogButtonBox::Cancel|QDialogButtonBox::Ok);

        gridLayout->addWidget(buttonBox, 8, 3, 1, 1);

        tabWidget = new QTabWidget(DialogBasicSettings);
        tabWidget->setObjectName(QString::fromUtf8("tabWidget"));
        tab_1 = new QWidget();
        tab_1->setObjectName(QString::fromUtf8("tab_1"));
        verticalLayout_2 = new QVBoxLayout(tab_1);
        verticalLayout_2->setObjectName(QString::fromUtf8("verticalLayout_2"));
        hlayout_l1 = new QHBoxLayout();
        hlayout_l1->setObjectName(QString::fromUtf8("hlayout_l1"));
        horizontalGroupBox_3 = new QGroupBox(tab_1);
        horizontalGroupBox_3->setObjectName(QString::fromUtf8("horizontalGroupBox_3"));
        horizontalLayout_19 = new QHBoxLayout(horizontalGroupBox_3);
        horizontalLayout_19->setObjectName(QString::fromUtf8("horizontalLayout_19"));
        label = new QLabel(horizontalGroupBox_3);
        label->setObjectName(QString::fromUtf8("label"));

        horizontalLayout_19->addWidget(label);

        inbound_address = new QLineEdit(horizontalGroupBox_3);
        inbound_address->setObjectName(QString::fromUtf8("inbound_address"));

        horizontalLayout_19->addWidget(inbound_address);

        inbound_auth = new QPushButton(horizontalGroupBox_3);
        inbound_auth->setObjectName(QString::fromUtf8("inbound_auth"));
        inbound_auth->setText(QString::fromUtf8(""));

        horizontalLayout_19->addWidget(inbound_auth);


        hlayout_l1->addWidget(horizontalGroupBox_3);

        groupbox_custom_inbound = new QGroupBox(tab_1);
        groupbox_custom_inbound->setObjectName(QString::fromUtf8("groupbox_custom_inbound"));
        horizontalLayout_10 = new QHBoxLayout(groupbox_custom_inbound);
        horizontalLayout_10->setObjectName(QString::fromUtf8("horizontalLayout_10"));
        label_11 = new QLabel(groupbox_custom_inbound);
        label_11->setObjectName(QString::fromUtf8("label_11"));

        horizontalLayout_10->addWidget(label_11);

        custom_inbound_edit = new QPushButton(groupbox_custom_inbound);
        custom_inbound_edit->setObjectName(QString::fromUtf8("custom_inbound_edit"));

        horizontalLayout_10->addWidget(custom_inbound_edit);


        hlayout_l1->addWidget(groupbox_custom_inbound);


        verticalLayout_2->addLayout(hlayout_l1);

        hlayout_l2 = new QHBoxLayout();
        hlayout_l2->setObjectName(QString::fromUtf8("hlayout_l2"));
        horizontalGroupBox_2 = new QGroupBox(tab_1);
        horizontalGroupBox_2->setObjectName(QString::fromUtf8("horizontalGroupBox_2"));
        horizontalLayout_13 = new QHBoxLayout(horizontalGroupBox_2);
        horizontalLayout_13->setObjectName(QString::fromUtf8("horizontalLayout_13"));
        inbound_socks_port_l = new QLabel(horizontalGroupBox_2);
        inbound_socks_port_l->setObjectName(QString::fromUtf8("inbound_socks_port_l"));

        horizontalLayout_13->addWidget(inbound_socks_port_l);

        inbound_socks_port = new QLineEdit(horizontalGroupBox_2);
        inbound_socks_port->setObjectName(QString::fromUtf8("inbound_socks_port"));
        QSizePolicy sizePolicy1(QSizePolicy::Preferred, QSizePolicy::Fixed);
        sizePolicy1.setHorizontalStretch(0);
        sizePolicy1.setVerticalStretch(0);
        sizePolicy1.setHeightForWidth(inbound_socks_port->sizePolicy().hasHeightForWidth());
        inbound_socks_port->setSizePolicy(sizePolicy1);

        horizontalLayout_13->addWidget(inbound_socks_port);


        hlayout_l2->addWidget(horizontalGroupBox_2);


        verticalLayout_2->addLayout(hlayout_l2);

        groupBox1 = new QGroupBox(tab_1);
        groupBox1->setObjectName(QString::fromUtf8("groupBox1"));
        horizontalLayout_9 = new QHBoxLayout(groupBox1);
        horizontalLayout_9->setObjectName(QString::fromUtf8("horizontalLayout_9"));
        label_13 = new QLabel(groupBox1);
        label_13->setObjectName(QString::fromUtf8("label_13"));

        horizontalLayout_9->addWidget(label_13);

        test_latency_url = new QLineEdit(groupBox1);
        test_latency_url->setObjectName(QString::fromUtf8("test_latency_url"));

        horizontalLayout_9->addWidget(test_latency_url);

        label_14 = new QLabel(groupBox1);
        label_14->setObjectName(QString::fromUtf8("label_14"));

        horizontalLayout_9->addWidget(label_14);

        test_concurrent = new QLineEdit(groupBox1);
        test_concurrent->setObjectName(QString::fromUtf8("test_concurrent"));

        horizontalLayout_9->addWidget(test_concurrent);

        horizontalLayout_9->setStretch(1, 8);
        horizontalLayout_9->setStretch(2, 1);
        horizontalLayout_9->setStretch(3, 1);

        verticalLayout_2->addWidget(groupBox1);

        horizontalGroupBox = new QGroupBox(tab_1);
        horizontalGroupBox->setObjectName(QString::fromUtf8("horizontalGroupBox"));
        horizontalLayout_12 = new QHBoxLayout(horizontalGroupBox);
        horizontalLayout_12->setObjectName(QString::fromUtf8("horizontalLayout_12"));
        label_19 = new QLabel(horizontalGroupBox);
        label_19->setObjectName(QString::fromUtf8("label_19"));

        horizontalLayout_12->addWidget(label_19);

        test_download_url = new MyLineEdit(horizontalGroupBox);
        test_download_url->setObjectName(QString::fromUtf8("test_download_url"));

        horizontalLayout_12->addWidget(test_download_url);

        label_10 = new QLabel(horizontalGroupBox);
        label_10->setObjectName(QString::fromUtf8("label_10"));

        horizontalLayout_12->addWidget(label_10);

        test_download_timeout = new QLineEdit(horizontalGroupBox);
        test_download_timeout->setObjectName(QString::fromUtf8("test_download_timeout"));

        horizontalLayout_12->addWidget(test_download_timeout);

        horizontalLayout_12->setStretch(1, 8);
        horizontalLayout_12->setStretch(2, 1);
        horizontalLayout_12->setStretch(3, 1);

        verticalLayout_2->addWidget(horizontalGroupBox);

        horizontalGroupBox1 = new QGroupBox(tab_1);
        horizontalGroupBox1->setObjectName(QString::fromUtf8("horizontalGroupBox1"));
        horizontalLayout_18 = new QHBoxLayout(horizontalGroupBox1);
        horizontalLayout_18->setObjectName(QString::fromUtf8("horizontalLayout_18"));
        check_include_pre = new QCheckBox(horizontalGroupBox1);
        check_include_pre->setObjectName(QString::fromUtf8("check_include_pre"));

        horizontalLayout_18->addWidget(check_include_pre);

        sys_proxy_format_vline = new QFrame(horizontalGroupBox1);
        sys_proxy_format_vline->setObjectName(QString::fromUtf8("sys_proxy_format_vline"));
        sys_proxy_format_vline->setFrameShape(QFrame::VLine);
        sys_proxy_format_vline->setFrameShadow(QFrame::Sunken);

        horizontalLayout_18->addWidget(sys_proxy_format_vline);

        old_share_link_format = new QCheckBox(horizontalGroupBox1);
        old_share_link_format->setObjectName(QString::fromUtf8("old_share_link_format"));

        horizontalLayout_18->addWidget(old_share_link_format);

        sys_proxy_format = new QPushButton(horizontalGroupBox1);
        sys_proxy_format->setObjectName(QString::fromUtf8("sys_proxy_format"));

        horizontalLayout_18->addWidget(sys_proxy_format);


        verticalLayout_2->addWidget(horizontalGroupBox1);

        horizontalWidget_1 = new QWidget(tab_1);
        horizontalWidget_1->setObjectName(QString::fromUtf8("horizontalWidget_1"));
        QSizePolicy sizePolicy2(QSizePolicy::Preferred, QSizePolicy::Maximum);
        sizePolicy2.setHorizontalStretch(0);
        sizePolicy2.setVerticalStretch(0);
        sizePolicy2.setHeightForWidth(horizontalWidget_1->sizePolicy().hasHeightForWidth());
        horizontalWidget_1->setSizePolicy(sizePolicy2);
        horizontalLayout_2 = new QHBoxLayout(horizontalWidget_1);
        horizontalLayout_2->setObjectName(QString::fromUtf8("horizontalLayout_2"));
        horizontalLayout_2->setContentsMargins(0, 0, 0, 0);

        verticalLayout_2->addWidget(horizontalWidget_1);

        tabWidget->addTab(tab_1, QString());
        tab_2 = new QWidget();
        tab_2->setObjectName(QString::fromUtf8("tab_2"));
        gridLayout_5 = new QGridLayout(tab_2);
        gridLayout_5->setObjectName(QString::fromUtf8("gridLayout_5"));
        style_h_1 = new QHBoxLayout();
        style_h_1->setObjectName(QString::fromUtf8("style_h_1"));
        groupBox = new QGroupBox(tab_2);
        groupBox->setObjectName(QString::fromUtf8("groupBox"));
        horizontalLayout_4 = new QHBoxLayout(groupBox);
        horizontalLayout_4->setObjectName(QString::fromUtf8("horizontalLayout_4"));
        label_8 = new QLabel(groupBox);
        label_8->setObjectName(QString::fromUtf8("label_8"));
        QSizePolicy sizePolicy3(QSizePolicy::Maximum, QSizePolicy::Maximum);
        sizePolicy3.setHorizontalStretch(0);
        sizePolicy3.setVerticalStretch(0);
        sizePolicy3.setHeightForWidth(label_8->sizePolicy().hasHeightForWidth());
        label_8->setSizePolicy(sizePolicy3);

        horizontalLayout_4->addWidget(label_8);

        theme = new QComboBox(groupBox);
        theme->addItem(QString());
        theme->addItem(QString::fromUtf8("flatgray"));
        theme->addItem(QString::fromUtf8("lightblue"));
        theme->addItem(QString::fromUtf8("blacksoft"));
        theme->setObjectName(QString::fromUtf8("theme"));

        horizontalLayout_4->addWidget(theme);

        set_custom_icon = new QPushButton(groupBox);
        set_custom_icon->setObjectName(QString::fromUtf8("set_custom_icon"));
        sizePolicy1.setHeightForWidth(set_custom_icon->sizePolicy().hasHeightForWidth());
        set_custom_icon->setSizePolicy(sizePolicy1);

        horizontalLayout_4->addWidget(set_custom_icon);


        style_h_1->addWidget(groupBox);

        groupBox2 = new QGroupBox(tab_2);
        groupBox2->setObjectName(QString::fromUtf8("groupBox2"));
        horizontalLayout_7 = new QHBoxLayout(groupBox2);
        horizontalLayout_7->setObjectName(QString::fromUtf8("horizontalLayout_7"));
        label_15 = new QLabel(groupBox2);
        label_15->setObjectName(QString::fromUtf8("label_15"));
        sizePolicy3.setHeightForWidth(label_15->sizePolicy().hasHeightForWidth());
        label_15->setSizePolicy(sizePolicy3);
        label_15->setText(QString::fromUtf8("Language"));

        horizontalLayout_7->addWidget(label_15);

        language = new QComboBox(groupBox2);
        language->addItem(QString::fromUtf8("System"));
        language->addItem(QString::fromUtf8("English"));
        language->addItem(QString::fromUtf8("\347\256\200\344\275\223\344\270\255\346\226\207"));
        language->addItem(QString::fromUtf8("\331\201\330\247\330\261\330\263\333\214"));
        language->addItem(QString::fromUtf8("\320\240\321\203\321\201\321\201\320\272\320\270\320\271"));
        language->setObjectName(QString::fromUtf8("language"));

        horizontalLayout_7->addWidget(language);


        style_h_1->addWidget(groupBox2);


        gridLayout_5->addLayout(style_h_1, 0, 0, 1, 1);

        style_h_2 = new QHBoxLayout();
        style_h_2->setObjectName(QString::fromUtf8("style_h_2"));
        traffic_statistics_box = new QGroupBox(tab_2);
        traffic_statistics_box->setObjectName(QString::fromUtf8("traffic_statistics_box"));
        horizontalLayout_3 = new QHBoxLayout(traffic_statistics_box);
        horizontalLayout_3->setObjectName(QString::fromUtf8("horizontalLayout_3"));
        label_16 = new QLabel(traffic_statistics_box);
        label_16->setObjectName(QString::fromUtf8("label_16"));

        horizontalLayout_3->addWidget(label_16);

        rfsh_r = new QComboBox(traffic_statistics_box);
        rfsh_r->addItem(QString::fromUtf8("500ms"));
        rfsh_r->addItem(QString::fromUtf8("1s"));
        rfsh_r->addItem(QString::fromUtf8("2s"));
        rfsh_r->addItem(QString::fromUtf8("3s"));
        rfsh_r->addItem(QString::fromUtf8("5s"));
        rfsh_r->addItem(QString());
        rfsh_r->setObjectName(QString::fromUtf8("rfsh_r"));

        horizontalLayout_3->addWidget(rfsh_r);


        style_h_2->addWidget(traffic_statistics_box);

        connection_statistics_box = new QGroupBox(tab_2);
        connection_statistics_box->setObjectName(QString::fromUtf8("connection_statistics_box"));
        horizontalLayout_15 = new QHBoxLayout(connection_statistics_box);
        horizontalLayout_15->setObjectName(QString::fromUtf8("horizontalLayout_15"));
        label_9 = new QLabel(connection_statistics_box);
        label_9->setObjectName(QString::fromUtf8("label_9"));

        horizontalLayout_15->addWidget(label_9);

        connection_statistics = new QCheckBox(connection_statistics_box);
        connection_statistics->setObjectName(QString::fromUtf8("connection_statistics"));

        horizontalLayout_15->addWidget(connection_statistics);


        style_h_2->addWidget(connection_statistics_box);


        gridLayout_5->addLayout(style_h_2, 2, 0, 1, 1);

        style_h_3 = new QHBoxLayout();
        style_h_3->setObjectName(QString::fromUtf8("style_h_3"));
        horizontalGroupBox_5 = new QGroupBox(tab_2);
        horizontalGroupBox_5->setObjectName(QString::fromUtf8("horizontalGroupBox_5"));
        horizontalLayout_6 = new QHBoxLayout(horizontalGroupBox_5);
        horizontalLayout_6->setObjectName(QString::fromUtf8("horizontalLayout_6"));
        start_minimal = new QCheckBox(horizontalGroupBox_5);
        start_minimal->setObjectName(QString::fromUtf8("start_minimal"));
        sizePolicy1.setHeightForWidth(start_minimal->sizePolicy().hasHeightForWidth());
        start_minimal->setSizePolicy(sizePolicy1);

        horizontalLayout_6->addWidget(start_minimal);


        style_h_3->addWidget(horizontalGroupBox_5);

        groupBox_2 = new QGroupBox(tab_2);
        groupBox_2->setObjectName(QString::fromUtf8("groupBox_2"));
        horizontalLayout_23 = new QHBoxLayout(groupBox_2);
        horizontalLayout_23->setObjectName(QString::fromUtf8("horizontalLayout_23"));
        label_17 = new QLabel(groupBox_2);
        label_17->setObjectName(QString::fromUtf8("label_17"));

        horizontalLayout_23->addWidget(label_17);

        max_log_line = new QLineEdit(groupBox_2);
        max_log_line->setObjectName(QString::fromUtf8("max_log_line"));
        QSizePolicy sizePolicy4(QSizePolicy::Ignored, QSizePolicy::Fixed);
        sizePolicy4.setHorizontalStretch(0);
        sizePolicy4.setVerticalStretch(0);
        sizePolicy4.setHeightForWidth(max_log_line->sizePolicy().hasHeightForWidth());
        max_log_line->setSizePolicy(sizePolicy4);

        horizontalLayout_23->addWidget(max_log_line);


        style_h_3->addWidget(groupBox_2);


        gridLayout_5->addLayout(style_h_3, 3, 0, 1, 1);

        tabWidget->addTab(tab_2, QString());
        tab_3 = new QWidget();
        tab_3->setObjectName(QString::fromUtf8("tab_3"));
        gridLayout_3 = new QGridLayout(tab_3);
        gridLayout_3->setObjectName(QString::fromUtf8("gridLayout_3"));
        horizontalLayout_5 = new QHBoxLayout();
        horizontalLayout_5->setObjectName(QString::fromUtf8("horizontalLayout_5"));
        sub_auto_update_enable = new QCheckBox(tab_3);
        sub_auto_update_enable->setObjectName(QString::fromUtf8("sub_auto_update_enable"));
        QSizePolicy sizePolicy5(QSizePolicy::Minimum, QSizePolicy::Fixed);
        sizePolicy5.setHorizontalStretch(0);
        sizePolicy5.setVerticalStretch(0);
        sizePolicy5.setHeightForWidth(sub_auto_update_enable->sizePolicy().hasHeightForWidth());
        sub_auto_update_enable->setSizePolicy(sizePolicy5);

        horizontalLayout_5->addWidget(sub_auto_update_enable);

        label_21 = new QLabel(tab_3);
        label_21->setObjectName(QString::fromUtf8("label_21"));

        horizontalLayout_5->addWidget(label_21);

        sub_auto_update = new QLineEdit(tab_3);
        sub_auto_update->setObjectName(QString::fromUtf8("sub_auto_update"));
        sizePolicy1.setHeightForWidth(sub_auto_update->sizePolicy().hasHeightForWidth());
        sub_auto_update->setSizePolicy(sizePolicy1);

        horizontalLayout_5->addWidget(sub_auto_update);


        gridLayout_3->addLayout(horizontalLayout_5, 0, 1, 1, 1);

        user_agent = new MyLineEdit(tab_3);
        user_agent->setObjectName(QString::fromUtf8("user_agent"));

        gridLayout_3->addWidget(user_agent, 1, 1, 1, 1);

        sub_use_proxy = new QCheckBox(tab_3);
        sub_use_proxy->setObjectName(QString::fromUtf8("sub_use_proxy"));

        gridLayout_3->addWidget(sub_use_proxy, 2, 1, 1, 1);

        sub_insecure = new QCheckBox(tab_3);
        sub_insecure->setObjectName(QString::fromUtf8("sub_insecure"));

        gridLayout_3->addWidget(sub_insecure, 3, 1, 1, 1);

        sub_clear = new QCheckBox(tab_3);
        sub_clear->setObjectName(QString::fromUtf8("sub_clear"));

        gridLayout_3->addWidget(sub_clear, 4, 1, 1, 1);

        label_20 = new QLabel(tab_3);
        label_20->setObjectName(QString::fromUtf8("label_20"));
        sizePolicy2.setHeightForWidth(label_20->sizePolicy().hasHeightForWidth());
        label_20->setSizePolicy(sizePolicy2);

        gridLayout_3->addWidget(label_20, 0, 0, 1, 1);

        label_4 = new QLabel(tab_3);
        label_4->setObjectName(QString::fromUtf8("label_4"));

        gridLayout_3->addWidget(label_4, 1, 0, 1, 1);

        tabWidget->addTab(tab_3, QString());
        tab_4 = new QWidget();
        tab_4->setObjectName(QString::fromUtf8("tab_4"));
        verticalLayout = new QVBoxLayout(tab_4);
        verticalLayout->setObjectName(QString::fromUtf8("verticalLayout"));
        groupBox_core = new QGroupBox(tab_4);
        groupBox_core->setObjectName(QString::fromUtf8("groupBox_core"));
        sizePolicy2.setHeightForWidth(groupBox_core->sizePolicy().hasHeightForWidth());
        groupBox_core->setSizePolicy(sizePolicy2);
        groupBox_core->setTitle(QString::fromUtf8("core_name"));
        verticalLayout_3 = new QVBoxLayout(groupBox_core);
        verticalLayout_3->setObjectName(QString::fromUtf8("verticalLayout_3"));
        assest_group = new QWidget(groupBox_core);
        assest_group->setObjectName(QString::fromUtf8("assest_group"));
        gridLayout_2 = new QGridLayout(assest_group);
        gridLayout_2->setObjectName(QString::fromUtf8("gridLayout_2"));
        log_level = new QComboBox(assest_group);
        log_level->setObjectName(QString::fromUtf8("log_level"));
        QSizePolicy sizePolicy6(QSizePolicy::Maximum, QSizePolicy::Fixed);
        sizePolicy6.setHorizontalStretch(0);
        sizePolicy6.setVerticalStretch(0);
        sizePolicy6.setHeightForWidth(log_level->sizePolicy().hasHeightForWidth());
        log_level->setSizePolicy(sizePolicy6);

        gridLayout_2->addWidget(log_level, 0, 1, 1, 1);

        label_6 = new QLabel(assest_group);
        label_6->setObjectName(QString::fromUtf8("label_6"));

        gridLayout_2->addWidget(label_6, 1, 0, 1, 1);

        label_3 = new QLabel(assest_group);
        label_3->setObjectName(QString::fromUtf8("label_3"));
        label_3->setText(QString::fromUtf8("Loglevel"));

        gridLayout_2->addWidget(label_3, 0, 0, 1, 1);

        horizontalLayout = new QHBoxLayout();
        horizontalLayout->setObjectName(QString::fromUtf8("horizontalLayout"));
        mux_protocol = new QComboBox(assest_group);
        mux_protocol->setObjectName(QString::fromUtf8("mux_protocol"));

        horizontalLayout->addWidget(mux_protocol);

        label_7 = new QLabel(assest_group);
        label_7->setObjectName(QString::fromUtf8("label_7"));

        horizontalLayout->addWidget(label_7);

        mux_concurrency = new QLineEdit(assest_group);
        mux_concurrency->setObjectName(QString::fromUtf8("mux_concurrency"));

        horizontalLayout->addWidget(mux_concurrency);

        mux_padding = new QCheckBox(assest_group);
        mux_padding->setObjectName(QString::fromUtf8("mux_padding"));
        mux_padding->setText(QString::fromUtf8("Padding"));

        horizontalLayout->addWidget(mux_padding);

        mux_default_on = new QCheckBox(assest_group);
        mux_default_on->setObjectName(QString::fromUtf8("mux_default_on"));

        horizontalLayout->addWidget(mux_default_on);


        gridLayout_2->addLayout(horizontalLayout, 1, 1, 1, 1);


        verticalLayout_3->addWidget(assest_group);

        core_settings = new QPushButton(groupBox_core);
        core_settings->setObjectName(QString::fromUtf8("core_settings"));

        verticalLayout_3->addWidget(core_settings);


        verticalLayout->addWidget(groupBox_core);

        tabWidget->addTab(tab_4, QString());
        tab_6 = new QWidget();
        tab_6->setObjectName(QString::fromUtf8("tab_6"));
        verticalLayout_5 = new QVBoxLayout(tab_6);
        verticalLayout_5->setObjectName(QString::fromUtf8("verticalLayout_5"));
        extra_core_box_scrollArea = new QScrollArea(tab_6);
        extra_core_box_scrollArea->setObjectName(QString::fromUtf8("extra_core_box_scrollArea"));
        extra_core_box_scrollArea->setFrameShape(QFrame::NoFrame);
        extra_core_box_scrollArea->setWidgetResizable(true);
        extra_core_box_scrollAreaWidgetContents = new QWidget();
        extra_core_box_scrollAreaWidgetContents->setObjectName(QString::fromUtf8("extra_core_box_scrollAreaWidgetContents"));
        extra_core_box_scrollAreaWidgetContents->setGeometry(QRect(0, 0, 632, 299));
        verticalLayout_6 = new QVBoxLayout(extra_core_box_scrollAreaWidgetContents);
        verticalLayout_6->setObjectName(QString::fromUtf8("verticalLayout_6"));
        horizontalWidget_4 = new QWidget(extra_core_box_scrollAreaWidgetContents);
        horizontalWidget_4->setObjectName(QString::fromUtf8("horizontalWidget_4"));
        sizePolicy2.setHeightForWidth(horizontalWidget_4->sizePolicy().hasHeightForWidth());
        horizontalWidget_4->setSizePolicy(sizePolicy2);
        horizontalLayout_8 = new QHBoxLayout(horizontalWidget_4);
        horizontalLayout_8->setObjectName(QString::fromUtf8("horizontalLayout_8"));
        extra_core_add = new QPushButton(horizontalWidget_4);
        extra_core_add->setObjectName(QString::fromUtf8("extra_core_add"));

        horizontalLayout_8->addWidget(extra_core_add);

        extra_core_del = new QPushButton(horizontalWidget_4);
        extra_core_del->setObjectName(QString::fromUtf8("extra_core_del"));

        horizontalLayout_8->addWidget(extra_core_del);


        verticalLayout_6->addWidget(horizontalWidget_4);

        extra_core_box_scrollArea->setWidget(extra_core_box_scrollAreaWidgetContents);

        verticalLayout_5->addWidget(extra_core_box_scrollArea);

        tabWidget->addTab(tab_6, QString());
        tab_5 = new QWidget();
        tab_5->setObjectName(QString::fromUtf8("tab_5"));
        verticalLayout_4 = new QVBoxLayout(tab_5);
        verticalLayout_4->setObjectName(QString::fromUtf8("verticalLayout_4"));
        skip_cert = new QCheckBox(tab_5);
        skip_cert->setObjectName(QString::fromUtf8("skip_cert"));

        verticalLayout_4->addWidget(skip_cert);

        horizontalGroupBox2 = new QGroupBox(tab_5);
        horizontalGroupBox2->setObjectName(QString::fromUtf8("horizontalGroupBox2"));
        sizePolicy2.setHeightForWidth(horizontalGroupBox2->sizePolicy().hasHeightForWidth());
        horizontalGroupBox2->setSizePolicy(sizePolicy2);
        horizontalLayout_26 = new QHBoxLayout(horizontalGroupBox2);
        horizontalLayout_26->setObjectName(QString::fromUtf8("horizontalLayout_26"));
        label_18 = new QLabel(horizontalGroupBox2);
        label_18->setObjectName(QString::fromUtf8("label_18"));

        horizontalLayout_26->addWidget(label_18);

        utlsFingerprint = new QComboBox(horizontalGroupBox2);
        utlsFingerprint->setObjectName(QString::fromUtf8("utlsFingerprint"));
        utlsFingerprint->setEditable(true);

        horizontalLayout_26->addWidget(utlsFingerprint);


        verticalLayout_4->addWidget(horizontalGroupBox2);

        tabWidget->addTab(tab_5, QString());

        gridLayout->addWidget(tabWidget, 2, 3, 1, 1);


        retranslateUi(DialogBasicSettings);
        QObject::connect(buttonBox, SIGNAL(accepted()), DialogBasicSettings, SLOT(accept()));
        QObject::connect(buttonBox, SIGNAL(rejected()), DialogBasicSettings, SLOT(reject()));

        tabWidget->setCurrentIndex(0);


        QMetaObject::connectSlotsByName(DialogBasicSettings);
    } // setupUi

    void retranslateUi(QDialog *DialogBasicSettings)
    {
        DialogBasicSettings->setWindowTitle(QCoreApplication::translate("DialogBasicSettings", "Basic Settings", nullptr));
        label->setText(QCoreApplication::translate("DialogBasicSettings", "Listen Address", nullptr));
        label_11->setText(QCoreApplication::translate("DialogBasicSettings", "Custom Inbound", nullptr));
        custom_inbound_edit->setText(QCoreApplication::translate("DialogBasicSettings", "Edit", nullptr));
        inbound_socks_port_l->setText(QCoreApplication::translate("DialogBasicSettings", "Mixed (SOCKS+HTTP) Listen Port", nullptr));
        label_13->setText(QCoreApplication::translate("DialogBasicSettings", "Latency Test URL", nullptr));
        label_14->setText(QCoreApplication::translate("DialogBasicSettings", "Concurrent", nullptr));
        label_19->setText(QCoreApplication::translate("DialogBasicSettings", "Download Test URL", nullptr));
        label_10->setText(QCoreApplication::translate("DialogBasicSettings", "Timeout (s)", nullptr));
        check_include_pre->setText(QCoreApplication::translate("DialogBasicSettings", "Include Pre-release when checking update", nullptr));
#if QT_CONFIG(tooltip)
        old_share_link_format->setToolTip(QCoreApplication::translate("DialogBasicSettings", "Share VMess Link with v2rayN Format", nullptr));
#endif // QT_CONFIG(tooltip)
        old_share_link_format->setText(QCoreApplication::translate("DialogBasicSettings", "Old Share Link Format", nullptr));
        sys_proxy_format->setText(QCoreApplication::translate("DialogBasicSettings", "System proxy format", nullptr));
        tabWidget->setTabText(tabWidget->indexOf(tab_1), QCoreApplication::translate("DialogBasicSettings", "Common", nullptr));
        label_8->setText(QCoreApplication::translate("DialogBasicSettings", "Theme", nullptr));
        theme->setItemText(0, QCoreApplication::translate("DialogBasicSettings", "System", nullptr));

        set_custom_icon->setText(QCoreApplication::translate("DialogBasicSettings", "Set custom icon", nullptr));

        label_16->setText(QCoreApplication::translate("DialogBasicSettings", "Statistics refresh rate", nullptr));
        rfsh_r->setItemText(5, QCoreApplication::translate("DialogBasicSettings", "Off", nullptr));

        label_9->setText(QCoreApplication::translate("DialogBasicSettings", "Connection statistics", nullptr));
        connection_statistics->setText(QCoreApplication::translate("DialogBasicSettings", "Enable", nullptr));
        start_minimal->setText(QCoreApplication::translate("DialogBasicSettings", "Hide dashboard at startup", nullptr));
        label_17->setText(QCoreApplication::translate("DialogBasicSettings", "Max log lines", nullptr));
        tabWidget->setTabText(tabWidget->indexOf(tab_2), QCoreApplication::translate("DialogBasicSettings", "Style", nullptr));
        sub_auto_update_enable->setText(QCoreApplication::translate("DialogBasicSettings", "Enable", nullptr));
        label_21->setText(QCoreApplication::translate("DialogBasicSettings", "Interval (minute, invalid if less than 30)", nullptr));
        sub_use_proxy->setText(QCoreApplication::translate("DialogBasicSettings", "Use proxy when updating subscription", nullptr));
        sub_insecure->setText(QCoreApplication::translate("DialogBasicSettings", "Ignore TLS errors when updating subscription", nullptr));
        sub_clear->setText(QCoreApplication::translate("DialogBasicSettings", "Clear servers before updating subscription", nullptr));
        label_20->setText(QCoreApplication::translate("DialogBasicSettings", "Automatic update", nullptr));
        label_4->setText(QCoreApplication::translate("DialogBasicSettings", "User Agent", nullptr));
        tabWidget->setTabText(tabWidget->indexOf(tab_3), QCoreApplication::translate("DialogBasicSettings", "Subscription", nullptr));
        label_6->setText(QCoreApplication::translate("DialogBasicSettings", "Multiplex (mux)", nullptr));
        label_7->setText(QCoreApplication::translate("DialogBasicSettings", "concurrency", nullptr));
        mux_default_on->setText(QCoreApplication::translate("DialogBasicSettings", "Default On", nullptr));
        core_settings->setText(QCoreApplication::translate("DialogBasicSettings", "Core Options", nullptr));
        tabWidget->setTabText(tabWidget->indexOf(tab_4), QCoreApplication::translate("DialogBasicSettings", "Core", nullptr));
        extra_core_add->setText(QCoreApplication::translate("DialogBasicSettings", "Add", nullptr));
        extra_core_del->setText(QCoreApplication::translate("DialogBasicSettings", "Delete", nullptr));
        tabWidget->setTabText(tabWidget->indexOf(tab_6), QCoreApplication::translate("DialogBasicSettings", "Extra Core", nullptr));
        skip_cert->setText(QCoreApplication::translate("DialogBasicSettings", "Skip TLS certificate authentication by default (allowInsecure)", nullptr));
        label_18->setText(QCoreApplication::translate("DialogBasicSettings", "Default uTLS Fingerprint", nullptr));
        tabWidget->setTabText(tabWidget->indexOf(tab_5), QCoreApplication::translate("DialogBasicSettings", "Security", nullptr));
    } // retranslateUi

};

namespace Ui {
    class DialogBasicSettings: public Ui_DialogBasicSettings {};
} // namespace Ui

QT_END_NAMESPACE

#endif // UI_DIALOG_BASIC_SETTINGS_H

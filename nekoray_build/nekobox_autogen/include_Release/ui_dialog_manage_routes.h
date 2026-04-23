/********************************************************************************
** Form generated from reading UI file 'dialog_manage_routes.ui'
**
** Created by: Qt User Interface Compiler version 5.15.2
**
** WARNING! All changes made in this file will be lost when recompiling UI file!
********************************************************************************/

#ifndef UI_DIALOG_MANAGE_ROUTES_H
#define UI_DIALOG_MANAGE_ROUTES_H

#include <QtCore/QVariant>
#include <QtWidgets/QApplication>
#include <QtWidgets/QCheckBox>
#include <QtWidgets/QComboBox>
#include <QtWidgets/QDialog>
#include <QtWidgets/QDialogButtonBox>
#include <QtWidgets/QGridLayout>
#include <QtWidgets/QGroupBox>
#include <QtWidgets/QHBoxLayout>
#include <QtWidgets/QLabel>
#include <QtWidgets/QPlainTextEdit>
#include <QtWidgets/QPushButton>
#include <QtWidgets/QSpacerItem>
#include <QtWidgets/QTabWidget>
#include <QtWidgets/QToolButton>
#include <QtWidgets/QVBoxLayout>
#include <QtWidgets/QWidget>

QT_BEGIN_NAMESPACE

class Ui_DialogManageRoutes
{
public:
    QVBoxLayout *verticalLayout;
    QTabWidget *tabWidget;
    QWidget *tab;
    QVBoxLayout *verticalLayout_3;
    QWidget *widget;
    QGridLayout *gridLayout_2;
    QSpacerItem *verticalSpacer;
    QGroupBox *groupBox;
    QVBoxLayout *verticalLayout_7;
    QPushButton *load_save;
    QPushButton *custom_route_global_edit;
    QLabel *label_5;
    QLabel *label_6;
    QComboBox *outbound_domain_strategy;
    QComboBox *sniffing_mode;
    QLabel *label;
    QLabel *label_3;
    QComboBox *domainStrategyCombo;
    QSpacerItem *horizontalSpacer_3;
    QWidget *tab_3;
    QVBoxLayout *verticalLayout_4;
    QGroupBox *simple_dns_box;
    QGridLayout *gridLayout;
    QLabel *label_8;
    QHBoxLayout *horizontalLayout_7;
    QComboBox *remote_dns;
    QLabel *label_10;
    QComboBox *remote_dns_strategy;
    QLabel *label_9;
    QHBoxLayout *horizontalLayout_3;
    QCheckBox *dns_routing;
    QSpacerItem *horizontalSpacer_2;
    QLabel *dns_final_out_l;
    QComboBox *dns_final_out;
    QHBoxLayout *horizontalLayout_8;
    QComboBox *direct_dns;
    QLabel *label_11;
    QComboBox *direct_dns_strategy;
    QGroupBox *groupBox_2;
    QVBoxLayout *verticalLayout_5;
    QHBoxLayout *horizontalLayout_4;
    QCheckBox *use_dns_object;
    QPushButton *format_dns_object;
    QPushButton *dns_document;
    QPlainTextEdit *dns_object;
    QWidget *tab_2;
    QVBoxLayout *verticalLayout_6;
    QGroupBox *gb2;
    QVBoxLayout *verticalLayout_2;
    QGridLayout *gridLayout_3;
    QLabel *label_82;
    QGridLayout *blockTxtLayout;
    QLabel *label_80;
    QLabel *label_7;
    QGridLayout *directTxtLayout;
    QGridLayout *proxyIPLayout;
    QLabel *label_81;
    QGridLayout *proxyTxtLayout;
    QGridLayout *blockIPLayout;
    QLabel *label_2;
    QGridLayout *directIPLayout;
    QHBoxLayout *horizontalLayout_5;
    QWidget *horizontalWidget_2;
    QHBoxLayout *horizontalLayout_6;
    QToolButton *preset;
    QPushButton *custom_route_edit;
    QSpacerItem *horizontalSpacer;
    QWidget *horizontalWidget;
    QHBoxLayout *horizontalLayout_2;
    QLabel *label_4;
    QComboBox *def_outbound;
    QHBoxLayout *horizontalLayout;
    QDialogButtonBox *buttonBox;

    void setupUi(QDialog *DialogManageRoutes)
    {
        if (DialogManageRoutes->objectName().isEmpty())
            DialogManageRoutes->setObjectName(QString::fromUtf8("DialogManageRoutes"));
        DialogManageRoutes->resize(800, 600);
        verticalLayout = new QVBoxLayout(DialogManageRoutes);
        verticalLayout->setObjectName(QString::fromUtf8("verticalLayout"));
        tabWidget = new QTabWidget(DialogManageRoutes);
        tabWidget->setObjectName(QString::fromUtf8("tabWidget"));
        tab = new QWidget();
        tab->setObjectName(QString::fromUtf8("tab"));
        verticalLayout_3 = new QVBoxLayout(tab);
        verticalLayout_3->setObjectName(QString::fromUtf8("verticalLayout_3"));
        widget = new QWidget(tab);
        widget->setObjectName(QString::fromUtf8("widget"));
        gridLayout_2 = new QGridLayout(widget);
        gridLayout_2->setObjectName(QString::fromUtf8("gridLayout_2"));
        verticalSpacer = new QSpacerItem(20, 40, QSizePolicy::Minimum, QSizePolicy::Expanding);

        gridLayout_2->addItem(verticalSpacer, 4, 1, 1, 1);

        groupBox = new QGroupBox(widget);
        groupBox->setObjectName(QString::fromUtf8("groupBox"));
        verticalLayout_7 = new QVBoxLayout(groupBox);
        verticalLayout_7->setObjectName(QString::fromUtf8("verticalLayout_7"));
        load_save = new QPushButton(groupBox);
        load_save->setObjectName(QString::fromUtf8("load_save"));

        verticalLayout_7->addWidget(load_save);

        custom_route_global_edit = new QPushButton(groupBox);
        custom_route_global_edit->setObjectName(QString::fromUtf8("custom_route_global_edit"));

        verticalLayout_7->addWidget(custom_route_global_edit);

        label_5 = new QLabel(groupBox);
        label_5->setObjectName(QString::fromUtf8("label_5"));

        verticalLayout_7->addWidget(label_5);


        gridLayout_2->addWidget(groupBox, 5, 1, 1, 1);

        label_6 = new QLabel(widget);
        label_6->setObjectName(QString::fromUtf8("label_6"));
#if QT_CONFIG(tooltip)
        label_6->setToolTip(QString::fromUtf8("For V2Ray, it sets routing.domainStrategy\n"
"For sing-box, it sets inbound.domain_strategy"));
#endif // QT_CONFIG(tooltip)

        gridLayout_2->addWidget(label_6, 2, 0, 1, 1);

        outbound_domain_strategy = new QComboBox(widget);
        outbound_domain_strategy->setObjectName(QString::fromUtf8("outbound_domain_strategy"));
        outbound_domain_strategy->setEditable(false);

        gridLayout_2->addWidget(outbound_domain_strategy, 3, 1, 1, 1);

        sniffing_mode = new QComboBox(widget);
        sniffing_mode->addItem(QString());
        sniffing_mode->addItem(QString());
        sniffing_mode->addItem(QString());
        sniffing_mode->setObjectName(QString::fromUtf8("sniffing_mode"));

        gridLayout_2->addWidget(sniffing_mode, 1, 1, 1, 1);

        label = new QLabel(widget);
        label->setObjectName(QString::fromUtf8("label"));

        gridLayout_2->addWidget(label, 1, 0, 1, 1);

        label_3 = new QLabel(widget);
        label_3->setObjectName(QString::fromUtf8("label_3"));

        gridLayout_2->addWidget(label_3, 3, 0, 1, 1);

        domainStrategyCombo = new QComboBox(widget);
        domainStrategyCombo->setObjectName(QString::fromUtf8("domainStrategyCombo"));
        domainStrategyCombo->setEditable(false);

        gridLayout_2->addWidget(domainStrategyCombo, 2, 1, 1, 1);

        horizontalSpacer_3 = new QSpacerItem(40, 20, QSizePolicy::Expanding, QSizePolicy::Minimum);

        gridLayout_2->addItem(horizontalSpacer_3, 1, 2, 1, 1);


        verticalLayout_3->addWidget(widget);

        tabWidget->addTab(tab, QString());
        tab_3 = new QWidget();
        tab_3->setObjectName(QString::fromUtf8("tab_3"));
        verticalLayout_4 = new QVBoxLayout(tab_3);
        verticalLayout_4->setObjectName(QString::fromUtf8("verticalLayout_4"));
        simple_dns_box = new QGroupBox(tab_3);
        simple_dns_box->setObjectName(QString::fromUtf8("simple_dns_box"));
        gridLayout = new QGridLayout(simple_dns_box);
        gridLayout->setObjectName(QString::fromUtf8("gridLayout"));
        label_8 = new QLabel(simple_dns_box);
        label_8->setObjectName(QString::fromUtf8("label_8"));

        gridLayout->addWidget(label_8, 1, 0, 1, 1);

        horizontalLayout_7 = new QHBoxLayout();
        horizontalLayout_7->setObjectName(QString::fromUtf8("horizontalLayout_7"));
        remote_dns = new QComboBox(simple_dns_box);
        remote_dns->addItem(QString::fromUtf8("https://8.8.8.8/dns-query"));
        remote_dns->addItem(QString::fromUtf8("https://1.0.0.1/dns-query"));
        remote_dns->addItem(QString::fromUtf8("https://1.1.1.1/dns-query"));
        remote_dns->addItem(QString::fromUtf8("https://dns.google/dns-query"));
        remote_dns->addItem(QString::fromUtf8("https://one.one.one.one/dns-query"));
        remote_dns->addItem(QString::fromUtf8("https://[2001:4860:4860::8888]/dns-query"));
        remote_dns->addItem(QString::fromUtf8("https://[2606:4700:4700::1111]/dns-query"));
        remote_dns->setObjectName(QString::fromUtf8("remote_dns"));
        QSizePolicy sizePolicy(QSizePolicy::Expanding, QSizePolicy::Fixed);
        sizePolicy.setHorizontalStretch(0);
        sizePolicy.setVerticalStretch(0);
        sizePolicy.setHeightForWidth(remote_dns->sizePolicy().hasHeightForWidth());
        remote_dns->setSizePolicy(sizePolicy);
        remote_dns->setEditable(true);

        horizontalLayout_7->addWidget(remote_dns);

        label_10 = new QLabel(simple_dns_box);
        label_10->setObjectName(QString::fromUtf8("label_10"));

        horizontalLayout_7->addWidget(label_10);

        remote_dns_strategy = new QComboBox(simple_dns_box);
        remote_dns_strategy->setObjectName(QString::fromUtf8("remote_dns_strategy"));

        horizontalLayout_7->addWidget(remote_dns_strategy);


        gridLayout->addLayout(horizontalLayout_7, 0, 2, 1, 1);

        label_9 = new QLabel(simple_dns_box);
        label_9->setObjectName(QString::fromUtf8("label_9"));

        gridLayout->addWidget(label_9, 0, 0, 1, 1);

        horizontalLayout_3 = new QHBoxLayout();
        horizontalLayout_3->setObjectName(QString::fromUtf8("horizontalLayout_3"));
        dns_routing = new QCheckBox(simple_dns_box);
        dns_routing->setObjectName(QString::fromUtf8("dns_routing"));

        horizontalLayout_3->addWidget(dns_routing);

        horizontalSpacer_2 = new QSpacerItem(40, 20, QSizePolicy::Expanding, QSizePolicy::Minimum);

        horizontalLayout_3->addItem(horizontalSpacer_2);

        dns_final_out_l = new QLabel(simple_dns_box);
        dns_final_out_l->setObjectName(QString::fromUtf8("dns_final_out_l"));

        horizontalLayout_3->addWidget(dns_final_out_l);

        dns_final_out = new QComboBox(simple_dns_box);
        dns_final_out->addItem(QString::fromUtf8("proxy"));
        dns_final_out->addItem(QString::fromUtf8("bypass"));
        dns_final_out->setObjectName(QString::fromUtf8("dns_final_out"));

        horizontalLayout_3->addWidget(dns_final_out);


        gridLayout->addLayout(horizontalLayout_3, 2, 2, 1, 1);

        horizontalLayout_8 = new QHBoxLayout();
        horizontalLayout_8->setObjectName(QString::fromUtf8("horizontalLayout_8"));
        direct_dns = new QComboBox(simple_dns_box);
        direct_dns->addItem(QString::fromUtf8("local"));
        direct_dns->addItem(QString::fromUtf8("tls://120.53.53.53"));
        direct_dns->addItem(QString::fromUtf8("https://223.5.5.5/dns-query"));
        direct_dns->addItem(QString::fromUtf8("https://1.12.12.12/dns-query"));
        direct_dns->addItem(QString::fromUtf8("https://dns.alidns.com/dns-query"));
        direct_dns->addItem(QString::fromUtf8("https://doh.pub/dns-query"));
        direct_dns->addItem(QString::fromUtf8("223.5.5.5"));
        direct_dns->addItem(QString::fromUtf8("119.29.29.29"));
        direct_dns->addItem(QString::fromUtf8("2400:3200::1"));
        direct_dns->addItem(QString::fromUtf8("2402:4e00::"));
        direct_dns->setObjectName(QString::fromUtf8("direct_dns"));
        sizePolicy.setHeightForWidth(direct_dns->sizePolicy().hasHeightForWidth());
        direct_dns->setSizePolicy(sizePolicy);
        direct_dns->setEditable(true);

        horizontalLayout_8->addWidget(direct_dns);

        label_11 = new QLabel(simple_dns_box);
        label_11->setObjectName(QString::fromUtf8("label_11"));

        horizontalLayout_8->addWidget(label_11);

        direct_dns_strategy = new QComboBox(simple_dns_box);
        direct_dns_strategy->setObjectName(QString::fromUtf8("direct_dns_strategy"));

        horizontalLayout_8->addWidget(direct_dns_strategy);


        gridLayout->addLayout(horizontalLayout_8, 1, 2, 1, 1);


        verticalLayout_4->addWidget(simple_dns_box);

        groupBox_2 = new QGroupBox(tab_3);
        groupBox_2->setObjectName(QString::fromUtf8("groupBox_2"));
        verticalLayout_5 = new QVBoxLayout(groupBox_2);
        verticalLayout_5->setObjectName(QString::fromUtf8("verticalLayout_5"));
        horizontalLayout_4 = new QHBoxLayout();
        horizontalLayout_4->setObjectName(QString::fromUtf8("horizontalLayout_4"));
        use_dns_object = new QCheckBox(groupBox_2);
        use_dns_object->setObjectName(QString::fromUtf8("use_dns_object"));

        horizontalLayout_4->addWidget(use_dns_object);

        format_dns_object = new QPushButton(groupBox_2);
        format_dns_object->setObjectName(QString::fromUtf8("format_dns_object"));
        QSizePolicy sizePolicy1(QSizePolicy::Maximum, QSizePolicy::Fixed);
        sizePolicy1.setHorizontalStretch(0);
        sizePolicy1.setVerticalStretch(0);
        sizePolicy1.setHeightForWidth(format_dns_object->sizePolicy().hasHeightForWidth());
        format_dns_object->setSizePolicy(sizePolicy1);

        horizontalLayout_4->addWidget(format_dns_object);

        dns_document = new QPushButton(groupBox_2);
        dns_document->setObjectName(QString::fromUtf8("dns_document"));
        sizePolicy1.setHeightForWidth(dns_document->sizePolicy().hasHeightForWidth());
        dns_document->setSizePolicy(sizePolicy1);

        horizontalLayout_4->addWidget(dns_document);


        verticalLayout_5->addLayout(horizontalLayout_4);

        dns_object = new QPlainTextEdit(groupBox_2);
        dns_object->setObjectName(QString::fromUtf8("dns_object"));

        verticalLayout_5->addWidget(dns_object);


        verticalLayout_4->addWidget(groupBox_2);

        tabWidget->addTab(tab_3, QString());
        tab_2 = new QWidget();
        tab_2->setObjectName(QString::fromUtf8("tab_2"));
        verticalLayout_6 = new QVBoxLayout(tab_2);
        verticalLayout_6->setObjectName(QString::fromUtf8("verticalLayout_6"));
        gb2 = new QGroupBox(tab_2);
        gb2->setObjectName(QString::fromUtf8("gb2"));
        verticalLayout_2 = new QVBoxLayout(gb2);
        verticalLayout_2->setObjectName(QString::fromUtf8("verticalLayout_2"));
        gridLayout_3 = new QGridLayout();
        gridLayout_3->setObjectName(QString::fromUtf8("gridLayout_3"));
        label_82 = new QLabel(gb2);
        label_82->setObjectName(QString::fromUtf8("label_82"));
        label_82->setAlignment(Qt::AlignCenter);

        gridLayout_3->addWidget(label_82, 0, 3, 1, 1);

        blockTxtLayout = new QGridLayout();
        blockTxtLayout->setObjectName(QString::fromUtf8("blockTxtLayout"));

        gridLayout_3->addLayout(blockTxtLayout, 2, 3, 1, 1);

        label_80 = new QLabel(gb2);
        label_80->setObjectName(QString::fromUtf8("label_80"));
        label_80->setAlignment(Qt::AlignCenter);

        gridLayout_3->addWidget(label_80, 0, 1, 1, 1);

        label_7 = new QLabel(gb2);
        label_7->setObjectName(QString::fromUtf8("label_7"));
        label_7->setAlignment(Qt::AlignRight|Qt::AlignTrailing|Qt::AlignVCenter);

        gridLayout_3->addWidget(label_7, 2, 0, 1, 1);

        directTxtLayout = new QGridLayout();
        directTxtLayout->setObjectName(QString::fromUtf8("directTxtLayout"));

        gridLayout_3->addLayout(directTxtLayout, 2, 1, 1, 1);

        proxyIPLayout = new QGridLayout();
        proxyIPLayout->setObjectName(QString::fromUtf8("proxyIPLayout"));

        gridLayout_3->addLayout(proxyIPLayout, 1, 2, 1, 1);

        label_81 = new QLabel(gb2);
        label_81->setObjectName(QString::fromUtf8("label_81"));
        label_81->setAlignment(Qt::AlignCenter);

        gridLayout_3->addWidget(label_81, 0, 2, 1, 1);

        proxyTxtLayout = new QGridLayout();
        proxyTxtLayout->setObjectName(QString::fromUtf8("proxyTxtLayout"));

        gridLayout_3->addLayout(proxyTxtLayout, 2, 2, 1, 1);

        blockIPLayout = new QGridLayout();
        blockIPLayout->setObjectName(QString::fromUtf8("blockIPLayout"));

        gridLayout_3->addLayout(blockIPLayout, 1, 3, 1, 1);

        label_2 = new QLabel(gb2);
        label_2->setObjectName(QString::fromUtf8("label_2"));
        label_2->setAlignment(Qt::AlignRight|Qt::AlignTrailing|Qt::AlignVCenter);

        gridLayout_3->addWidget(label_2, 1, 0, 1, 1);

        directIPLayout = new QGridLayout();
        directIPLayout->setObjectName(QString::fromUtf8("directIPLayout"));

        gridLayout_3->addLayout(directIPLayout, 1, 1, 1, 1);

        gridLayout_3->setRowStretch(1, 1);
        gridLayout_3->setRowStretch(2, 1);
        gridLayout_3->setColumnStretch(1, 1);
        gridLayout_3->setColumnStretch(2, 1);
        gridLayout_3->setColumnStretch(3, 1);

        verticalLayout_2->addLayout(gridLayout_3);

        horizontalLayout_5 = new QHBoxLayout();
        horizontalLayout_5->setObjectName(QString::fromUtf8("horizontalLayout_5"));
        horizontalWidget_2 = new QWidget(gb2);
        horizontalWidget_2->setObjectName(QString::fromUtf8("horizontalWidget_2"));
        horizontalLayout_6 = new QHBoxLayout(horizontalWidget_2);
        horizontalLayout_6->setObjectName(QString::fromUtf8("horizontalLayout_6"));
        horizontalLayout_6->setContentsMargins(0, 0, 0, 0);
        preset = new QToolButton(horizontalWidget_2);
        preset->setObjectName(QString::fromUtf8("preset"));
        QSizePolicy sizePolicy2(QSizePolicy::Preferred, QSizePolicy::Fixed);
        sizePolicy2.setHorizontalStretch(0);
        sizePolicy2.setVerticalStretch(0);
        sizePolicy2.setHeightForWidth(preset->sizePolicy().hasHeightForWidth());
        preset->setSizePolicy(sizePolicy2);
        preset->setPopupMode(QToolButton::InstantPopup);
        preset->setToolButtonStyle(Qt::ToolButtonTextBesideIcon);

        horizontalLayout_6->addWidget(preset);

        custom_route_edit = new QPushButton(horizontalWidget_2);
        custom_route_edit->setObjectName(QString::fromUtf8("custom_route_edit"));

        horizontalLayout_6->addWidget(custom_route_edit);


        horizontalLayout_5->addWidget(horizontalWidget_2);

        horizontalSpacer = new QSpacerItem(40, 20, QSizePolicy::Expanding, QSizePolicy::Minimum);

        horizontalLayout_5->addItem(horizontalSpacer);

        horizontalWidget = new QWidget(gb2);
        horizontalWidget->setObjectName(QString::fromUtf8("horizontalWidget"));
        horizontalLayout_2 = new QHBoxLayout(horizontalWidget);
        horizontalLayout_2->setObjectName(QString::fromUtf8("horizontalLayout_2"));
        horizontalLayout_2->setContentsMargins(0, 0, 0, 0);
        label_4 = new QLabel(horizontalWidget);
        label_4->setObjectName(QString::fromUtf8("label_4"));

        horizontalLayout_2->addWidget(label_4);

        def_outbound = new QComboBox(horizontalWidget);
        def_outbound->addItem(QString::fromUtf8("proxy"));
        def_outbound->addItem(QString::fromUtf8("bypass"));
        def_outbound->addItem(QString::fromUtf8("block"));
        def_outbound->setObjectName(QString::fromUtf8("def_outbound"));

        horizontalLayout_2->addWidget(def_outbound);


        horizontalLayout_5->addWidget(horizontalWidget);


        verticalLayout_2->addLayout(horizontalLayout_5);


        verticalLayout_6->addWidget(gb2);

        tabWidget->addTab(tab_2, QString());

        verticalLayout->addWidget(tabWidget);

        horizontalLayout = new QHBoxLayout();
        horizontalLayout->setObjectName(QString::fromUtf8("horizontalLayout"));
        buttonBox = new QDialogButtonBox(DialogManageRoutes);
        buttonBox->setObjectName(QString::fromUtf8("buttonBox"));
        QSizePolicy sizePolicy3(QSizePolicy::Preferred, QSizePolicy::Preferred);
        sizePolicy3.setHorizontalStretch(0);
        sizePolicy3.setVerticalStretch(0);
        sizePolicy3.setHeightForWidth(buttonBox->sizePolicy().hasHeightForWidth());
        buttonBox->setSizePolicy(sizePolicy3);
        buttonBox->setStandardButtons(QDialogButtonBox::Cancel|QDialogButtonBox::Ok);

        horizontalLayout->addWidget(buttonBox);


        verticalLayout->addLayout(horizontalLayout);

#if QT_CONFIG(shortcut)
        label_9->setBuddy(widget);
#endif // QT_CONFIG(shortcut)
        QWidget::setTabOrder(tabWidget, sniffing_mode);
        QWidget::setTabOrder(sniffing_mode, domainStrategyCombo);
        QWidget::setTabOrder(domainStrategyCombo, outbound_domain_strategy);
        QWidget::setTabOrder(outbound_domain_strategy, load_save);
        QWidget::setTabOrder(load_save, custom_route_global_edit);
        QWidget::setTabOrder(custom_route_global_edit, remote_dns);
        QWidget::setTabOrder(remote_dns, remote_dns_strategy);
        QWidget::setTabOrder(remote_dns_strategy, direct_dns);
        QWidget::setTabOrder(direct_dns, direct_dns_strategy);
        QWidget::setTabOrder(direct_dns_strategy, dns_routing);
        QWidget::setTabOrder(dns_routing, dns_final_out);
        QWidget::setTabOrder(dns_final_out, use_dns_object);
        QWidget::setTabOrder(use_dns_object, format_dns_object);
        QWidget::setTabOrder(format_dns_object, dns_document);
        QWidget::setTabOrder(dns_document, dns_object);
        QWidget::setTabOrder(dns_object, preset);
        QWidget::setTabOrder(preset, custom_route_edit);
        QWidget::setTabOrder(custom_route_edit, def_outbound);

        retranslateUi(DialogManageRoutes);
        QObject::connect(buttonBox, SIGNAL(rejected()), DialogManageRoutes, SLOT(reject()));
        QObject::connect(buttonBox, SIGNAL(accepted()), DialogManageRoutes, SLOT(accept()));

        tabWidget->setCurrentIndex(0);


        QMetaObject::connectSlotsByName(DialogManageRoutes);
    } // setupUi

    void retranslateUi(QDialog *DialogManageRoutes)
    {
        DialogManageRoutes->setWindowTitle(QCoreApplication::translate("DialogManageRoutes", "Routes", nullptr));
        groupBox->setTitle(QCoreApplication::translate("DialogManageRoutes", "Route sets", nullptr));
        load_save->setText(QCoreApplication::translate("DialogManageRoutes", "Mange route set", nullptr));
        custom_route_global_edit->setText(QCoreApplication::translate("DialogManageRoutes", "Custom Route (global)", nullptr));
        label_5->setText(QCoreApplication::translate("DialogManageRoutes", "Note: Other settings are independent for each route set.", nullptr));
        label_6->setText(QCoreApplication::translate("DialogManageRoutes", "Domain Strategy", nullptr));
        sniffing_mode->setItemText(0, QCoreApplication::translate("DialogManageRoutes", "Disable", nullptr));
        sniffing_mode->setItemText(1, QCoreApplication::translate("DialogManageRoutes", "Sniff result for routing", nullptr));
        sniffing_mode->setItemText(2, QCoreApplication::translate("DialogManageRoutes", "Sniff result for destination", nullptr));

        label->setText(QCoreApplication::translate("DialogManageRoutes", "Sniffing Mode", nullptr));
        label_3->setText(QCoreApplication::translate("DialogManageRoutes", "Server Address Strategy", nullptr));
        tabWidget->setTabText(tabWidget->indexOf(tab), QCoreApplication::translate("DialogManageRoutes", "Common", nullptr));
        simple_dns_box->setTitle(QCoreApplication::translate("DialogManageRoutes", "Simple DNS Settings", nullptr));
#if QT_CONFIG(tooltip)
        label_8->setToolTip(QCoreApplication::translate("DialogManageRoutes", "This is especially important and it is recommended to use the default value of \"localhost\".\n"
"If the default value does not work, try changing it to \"223.5.5.5\".\n"
"For more information, see the document \"Configuration/DNS\".", nullptr));
#endif // QT_CONFIG(tooltip)
        label_8->setText(QCoreApplication::translate("DialogManageRoutes", "Direct DNS", nullptr));

        label_10->setText(QCoreApplication::translate("DialogManageRoutes", "Query Strategy", nullptr));
        label_9->setText(QCoreApplication::translate("DialogManageRoutes", "Remote DNS", nullptr));
        dns_routing->setText(QCoreApplication::translate("DialogManageRoutes", "Enable DNS Routing", nullptr));
        dns_final_out_l->setText(QCoreApplication::translate("DialogManageRoutes", "Final DNS Out", nullptr));


        label_11->setText(QCoreApplication::translate("DialogManageRoutes", "Query Strategy", nullptr));
        groupBox_2->setTitle(QCoreApplication::translate("DialogManageRoutes", "DNS Object Settings", nullptr));
        use_dns_object->setText(QCoreApplication::translate("DialogManageRoutes", "Use DNS Object", nullptr));
        format_dns_object->setText(QCoreApplication::translate("DialogManageRoutes", "Format", nullptr));
        dns_document->setText(QCoreApplication::translate("DialogManageRoutes", "Document", nullptr));
        tabWidget->setTabText(tabWidget->indexOf(tab_3), QCoreApplication::translate("DialogManageRoutes", "DNS", nullptr));
        label_82->setText(QCoreApplication::translate("DialogManageRoutes", "Block", nullptr));
        label_80->setText(QCoreApplication::translate("DialogManageRoutes", "Direct", nullptr));
        label_7->setText(QCoreApplication::translate("DialogManageRoutes", "Domain", nullptr));
        label_81->setText(QCoreApplication::translate("DialogManageRoutes", "Proxy", nullptr));
        label_2->setText(QCoreApplication::translate("DialogManageRoutes", "IP", nullptr));
        preset->setText(QCoreApplication::translate("DialogManageRoutes", "Preset", nullptr));
        custom_route_edit->setText(QCoreApplication::translate("DialogManageRoutes", "Custom Route", nullptr));
        label_4->setText(QCoreApplication::translate("DialogManageRoutes", "Default Outbound", nullptr));

        tabWidget->setTabText(tabWidget->indexOf(tab_2), QCoreApplication::translate("DialogManageRoutes", "Simple Route", nullptr));
    } // retranslateUi

};

namespace Ui {
    class DialogManageRoutes: public Ui_DialogManageRoutes {};
} // namespace Ui

QT_END_NAMESPACE

#endif // UI_DIALOG_MANAGE_ROUTES_H

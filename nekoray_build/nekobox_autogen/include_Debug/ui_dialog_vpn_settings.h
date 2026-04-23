/********************************************************************************
** Form generated from reading UI file 'dialog_vpn_settings.ui'
**
** Created by: Qt User Interface Compiler version 5.15.2
**
** WARNING! All changes made in this file will be lost when recompiling UI file!
********************************************************************************/

#ifndef UI_DIALOG_VPN_SETTINGS_H
#define UI_DIALOG_VPN_SETTINGS_H

#include <QtCore/QVariant>
#include <QtWidgets/QApplication>
#include <QtWidgets/QCheckBox>
#include <QtWidgets/QComboBox>
#include <QtWidgets/QDialog>
#include <QtWidgets/QDialogButtonBox>
#include <QtWidgets/QFrame>
#include <QtWidgets/QGroupBox>
#include <QtWidgets/QHBoxLayout>
#include <QtWidgets/QLabel>
#include <QtWidgets/QPlainTextEdit>
#include <QtWidgets/QPushButton>
#include <QtWidgets/QSpacerItem>
#include <QtWidgets/QVBoxLayout>

QT_BEGIN_NAMESPACE

class Ui_DialogVPNSettings
{
public:
    QVBoxLayout *verticalLayout;
    QGroupBox *groupBox;
    QHBoxLayout *horizontalLayout_5;
    QLabel *label_4;
    QComboBox *vpn_implementation;
    QLabel *label_10;
    QComboBox *vpn_mtu;
    QGroupBox *horizontalGroupBox_2;
    QHBoxLayout *horizontalLayout;
    QCheckBox *vpn_ipv6;
    QCheckBox *strict_route;
    QCheckBox *fake_dns;
    QFrame *line;
    QCheckBox *single_core;
    QCheckBox *hide_console;
    QHBoxLayout *horizontalLayout_2;
    QGroupBox *gb_cidr;
    QVBoxLayout *verticalLayout_2;
    QPlainTextEdit *vpn_rule_cidr;
    QGroupBox *gb_process_name;
    QVBoxLayout *verticalLayout_4;
    QPlainTextEdit *vpn_rule_process;
    QHBoxLayout *horizontalLayout_3;
    QCheckBox *whitelist_mode;
    QSpacerItem *horizontalSpacer;
    QPushButton *troubleshooting;
    QDialogButtonBox *buttonBox;

    void setupUi(QDialog *DialogVPNSettings)
    {
        if (DialogVPNSettings->objectName().isEmpty())
            DialogVPNSettings->setObjectName(QString::fromUtf8("DialogVPNSettings"));
        DialogVPNSettings->resize(600, 600);
        verticalLayout = new QVBoxLayout(DialogVPNSettings);
        verticalLayout->setObjectName(QString::fromUtf8("verticalLayout"));
        groupBox = new QGroupBox(DialogVPNSettings);
        groupBox->setObjectName(QString::fromUtf8("groupBox"));
        QSizePolicy sizePolicy(QSizePolicy::Preferred, QSizePolicy::Maximum);
        sizePolicy.setHorizontalStretch(0);
        sizePolicy.setVerticalStretch(0);
        sizePolicy.setHeightForWidth(groupBox->sizePolicy().hasHeightForWidth());
        groupBox->setSizePolicy(sizePolicy);
        horizontalLayout_5 = new QHBoxLayout(groupBox);
        horizontalLayout_5->setObjectName(QString::fromUtf8("horizontalLayout_5"));
        label_4 = new QLabel(groupBox);
        label_4->setObjectName(QString::fromUtf8("label_4"));
        QSizePolicy sizePolicy1(QSizePolicy::Maximum, QSizePolicy::Preferred);
        sizePolicy1.setHorizontalStretch(0);
        sizePolicy1.setVerticalStretch(0);
        sizePolicy1.setHeightForWidth(label_4->sizePolicy().hasHeightForWidth());
        label_4->setSizePolicy(sizePolicy1);
        label_4->setText(QString::fromUtf8("Stack"));

        horizontalLayout_5->addWidget(label_4);

        vpn_implementation = new QComboBox(groupBox);
        vpn_implementation->addItem(QString::fromUtf8("Mixed"));
        vpn_implementation->addItem(QString::fromUtf8("gVisor"));
        vpn_implementation->addItem(QString::fromUtf8("System"));
        vpn_implementation->setObjectName(QString::fromUtf8("vpn_implementation"));

        horizontalLayout_5->addWidget(vpn_implementation);

        label_10 = new QLabel(groupBox);
        label_10->setObjectName(QString::fromUtf8("label_10"));
        sizePolicy1.setHeightForWidth(label_10->sizePolicy().hasHeightForWidth());
        label_10->setSizePolicy(sizePolicy1);
        label_10->setText(QString::fromUtf8("MTU"));

        horizontalLayout_5->addWidget(label_10);

        vpn_mtu = new QComboBox(groupBox);
        vpn_mtu->addItem(QString::fromUtf8("9000"));
        vpn_mtu->addItem(QString::fromUtf8("1500"));
        vpn_mtu->setObjectName(QString::fromUtf8("vpn_mtu"));
        vpn_mtu->setEditable(true);

        horizontalLayout_5->addWidget(vpn_mtu);


        verticalLayout->addWidget(groupBox);

        horizontalGroupBox_2 = new QGroupBox(DialogVPNSettings);
        horizontalGroupBox_2->setObjectName(QString::fromUtf8("horizontalGroupBox_2"));
        horizontalLayout = new QHBoxLayout(horizontalGroupBox_2);
        horizontalLayout->setObjectName(QString::fromUtf8("horizontalLayout"));
        vpn_ipv6 = new QCheckBox(horizontalGroupBox_2);
        vpn_ipv6->setObjectName(QString::fromUtf8("vpn_ipv6"));

        horizontalLayout->addWidget(vpn_ipv6);

        strict_route = new QCheckBox(horizontalGroupBox_2);
        strict_route->setObjectName(QString::fromUtf8("strict_route"));
        strict_route->setText(QString::fromUtf8("Strict Route"));

        horizontalLayout->addWidget(strict_route);

        fake_dns = new QCheckBox(horizontalGroupBox_2);
        fake_dns->setObjectName(QString::fromUtf8("fake_dns"));
        fake_dns->setText(QString::fromUtf8("FakeDNS"));

        horizontalLayout->addWidget(fake_dns);

        line = new QFrame(horizontalGroupBox_2);
        line->setObjectName(QString::fromUtf8("line"));
        line->setFrameShape(QFrame::VLine);
        line->setFrameShadow(QFrame::Sunken);

        horizontalLayout->addWidget(line);

        single_core = new QCheckBox(horizontalGroupBox_2);
        single_core->setObjectName(QString::fromUtf8("single_core"));

        horizontalLayout->addWidget(single_core);

        hide_console = new QCheckBox(horizontalGroupBox_2);
        hide_console->setObjectName(QString::fromUtf8("hide_console"));

        horizontalLayout->addWidget(hide_console);


        verticalLayout->addWidget(horizontalGroupBox_2);

        horizontalLayout_2 = new QHBoxLayout();
        horizontalLayout_2->setObjectName(QString::fromUtf8("horizontalLayout_2"));
        gb_cidr = new QGroupBox(DialogVPNSettings);
        gb_cidr->setObjectName(QString::fromUtf8("gb_cidr"));
        verticalLayout_2 = new QVBoxLayout(gb_cidr);
        verticalLayout_2->setObjectName(QString::fromUtf8("verticalLayout_2"));
        vpn_rule_cidr = new QPlainTextEdit(gb_cidr);
        vpn_rule_cidr->setObjectName(QString::fromUtf8("vpn_rule_cidr"));

        verticalLayout_2->addWidget(vpn_rule_cidr);


        horizontalLayout_2->addWidget(gb_cidr);

        gb_process_name = new QGroupBox(DialogVPNSettings);
        gb_process_name->setObjectName(QString::fromUtf8("gb_process_name"));
        verticalLayout_4 = new QVBoxLayout(gb_process_name);
        verticalLayout_4->setObjectName(QString::fromUtf8("verticalLayout_4"));
        vpn_rule_process = new QPlainTextEdit(gb_process_name);
        vpn_rule_process->setObjectName(QString::fromUtf8("vpn_rule_process"));

        verticalLayout_4->addWidget(vpn_rule_process);


        horizontalLayout_2->addWidget(gb_process_name);


        verticalLayout->addLayout(horizontalLayout_2);

        horizontalLayout_3 = new QHBoxLayout();
        horizontalLayout_3->setObjectName(QString::fromUtf8("horizontalLayout_3"));
        whitelist_mode = new QCheckBox(DialogVPNSettings);
        whitelist_mode->setObjectName(QString::fromUtf8("whitelist_mode"));

        horizontalLayout_3->addWidget(whitelist_mode);

        horizontalSpacer = new QSpacerItem(40, 20, QSizePolicy::Expanding, QSizePolicy::Minimum);

        horizontalLayout_3->addItem(horizontalSpacer);

        troubleshooting = new QPushButton(DialogVPNSettings);
        troubleshooting->setObjectName(QString::fromUtf8("troubleshooting"));

        horizontalLayout_3->addWidget(troubleshooting);

        buttonBox = new QDialogButtonBox(DialogVPNSettings);
        buttonBox->setObjectName(QString::fromUtf8("buttonBox"));
        buttonBox->setStandardButtons(QDialogButtonBox::Cancel|QDialogButtonBox::Ok);

        horizontalLayout_3->addWidget(buttonBox);


        verticalLayout->addLayout(horizontalLayout_3);

        QWidget::setTabOrder(vpn_implementation, vpn_mtu);
        QWidget::setTabOrder(vpn_mtu, vpn_ipv6);
        QWidget::setTabOrder(vpn_ipv6, strict_route);
        QWidget::setTabOrder(strict_route, fake_dns);
        QWidget::setTabOrder(fake_dns, single_core);
        QWidget::setTabOrder(single_core, hide_console);
        QWidget::setTabOrder(hide_console, vpn_rule_cidr);
        QWidget::setTabOrder(vpn_rule_cidr, vpn_rule_process);
        QWidget::setTabOrder(vpn_rule_process, whitelist_mode);
        QWidget::setTabOrder(whitelist_mode, troubleshooting);

        retranslateUi(DialogVPNSettings);
        QObject::connect(buttonBox, SIGNAL(accepted()), DialogVPNSettings, SLOT(accept()));
        QObject::connect(buttonBox, SIGNAL(rejected()), DialogVPNSettings, SLOT(reject()));

        QMetaObject::connectSlotsByName(DialogVPNSettings);
    } // setupUi

    void retranslateUi(QDialog *DialogVPNSettings)
    {
        DialogVPNSettings->setWindowTitle(QCoreApplication::translate("DialogVPNSettings", "Tun Settings", nullptr));


        vpn_ipv6->setText(QCoreApplication::translate("DialogVPNSettings", "Tun Enable IPv6", nullptr));
#if QT_CONFIG(tooltip)
        single_core->setToolTip(QCoreApplication::translate("DialogVPNSettings", "Add a tun inbound to the profile startup, instead of using two processes.\n"
"This needs to be run NekoBox with administrator privileges.", nullptr));
#endif // QT_CONFIG(tooltip)
        single_core->setText(QCoreApplication::translate("DialogVPNSettings", "Internal Tun", nullptr));
        hide_console->setText(QCoreApplication::translate("DialogVPNSettings", "Hide Console", nullptr));
        gb_cidr->setTitle(QCoreApplication::translate("DialogVPNSettings", "Bypass CIDR", nullptr));
        gb_process_name->setTitle(QCoreApplication::translate("DialogVPNSettings", "Bypass Process Name", nullptr));
#if QT_CONFIG(tooltip)
        whitelist_mode->setToolTip(QCoreApplication::translate("DialogVPNSettings", "Whether blacklisted or whitelisted, your traffic will be handled by nekobox_core (sing-tun). This is NOT equal to \"process mode\" of some software.", nullptr));
#endif // QT_CONFIG(tooltip)
        whitelist_mode->setText(QCoreApplication::translate("DialogVPNSettings", "Whitelist mode", nullptr));
        troubleshooting->setText(QCoreApplication::translate("DialogVPNSettings", "Troubleshooting", nullptr));
    } // retranslateUi

};

namespace Ui {
    class DialogVPNSettings: public Ui_DialogVPNSettings {};
} // namespace Ui

QT_END_NAMESPACE

#endif // UI_DIALOG_VPN_SETTINGS_H

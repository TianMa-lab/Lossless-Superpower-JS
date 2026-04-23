/********************************************************************************
** Form generated from reading UI file 'edit_custom.ui'
**
** Created by: Qt User Interface Compiler version 5.15.2
**
** WARNING! All changes made in this file will be lost when recompiling UI file!
********************************************************************************/

#ifndef UI_EDIT_CUSTOM_H
#define UI_EDIT_CUSTOM_H

#include <QtCore/QVariant>
#include <QtWidgets/QApplication>
#include <QtWidgets/QComboBox>
#include <QtWidgets/QHBoxLayout>
#include <QtWidgets/QLabel>
#include <QtWidgets/QLineEdit>
#include <QtWidgets/QPlainTextEdit>
#include <QtWidgets/QPushButton>
#include <QtWidgets/QSpacerItem>
#include <QtWidgets/QVBoxLayout>
#include <QtWidgets/QWidget>

QT_BEGIN_NAMESPACE

class Ui_EditCustom
{
public:
    QVBoxLayout *verticalLayout;
    QHBoxLayout *horizontalLayout;
    QLabel *core_l;
    QComboBox *core;
    QSpacerItem *horizontalSpacer;
    QPushButton *as_json;
    QWidget *w_ext1;
    QHBoxLayout *horizontalLayout_2;
    QLabel *command_l;
    QLineEdit *command;
    QLabel *config_suffix_l;
    QComboBox *config_suffix;
    QWidget *w_ext2;
    QHBoxLayout *horizontalLayout_3;
    QLabel *label;
    QLineEdit *mapping_port;
    QLabel *label_2;
    QLineEdit *socks_port;
    QPushButton *preview;
    QPlainTextEdit *config_simple;

    void setupUi(QWidget *EditCustom)
    {
        if (EditCustom->objectName().isEmpty())
            EditCustom->setObjectName(QString::fromUtf8("EditCustom"));
        EditCustom->resize(400, 450);
        EditCustom->setWindowTitle(QString::fromUtf8("EditCustom"));
        verticalLayout = new QVBoxLayout(EditCustom);
        verticalLayout->setObjectName(QString::fromUtf8("verticalLayout"));
        horizontalLayout = new QHBoxLayout();
        horizontalLayout->setObjectName(QString::fromUtf8("horizontalLayout"));
        core_l = new QLabel(EditCustom);
        core_l->setObjectName(QString::fromUtf8("core_l"));
        QSizePolicy sizePolicy(QSizePolicy::Maximum, QSizePolicy::Preferred);
        sizePolicy.setHorizontalStretch(0);
        sizePolicy.setVerticalStretch(0);
        sizePolicy.setHeightForWidth(core_l->sizePolicy().hasHeightForWidth());
        core_l->setSizePolicy(sizePolicy);

        horizontalLayout->addWidget(core_l);

        core = new QComboBox(EditCustom);
        core->setObjectName(QString::fromUtf8("core"));
        QSizePolicy sizePolicy1(QSizePolicy::Expanding, QSizePolicy::Fixed);
        sizePolicy1.setHorizontalStretch(0);
        sizePolicy1.setVerticalStretch(0);
        sizePolicy1.setHeightForWidth(core->sizePolicy().hasHeightForWidth());
        core->setSizePolicy(sizePolicy1);
        core->setEditable(true);

        horizontalLayout->addWidget(core);

        horizontalSpacer = new QSpacerItem(40, 20, QSizePolicy::Expanding, QSizePolicy::Minimum);

        horizontalLayout->addItem(horizontalSpacer);

        as_json = new QPushButton(EditCustom);
        as_json->setObjectName(QString::fromUtf8("as_json"));
        QSizePolicy sizePolicy2(QSizePolicy::Maximum, QSizePolicy::Fixed);
        sizePolicy2.setHorizontalStretch(0);
        sizePolicy2.setVerticalStretch(0);
        sizePolicy2.setHeightForWidth(as_json->sizePolicy().hasHeightForWidth());
        as_json->setSizePolicy(sizePolicy2);

        horizontalLayout->addWidget(as_json);


        verticalLayout->addLayout(horizontalLayout);

        w_ext1 = new QWidget(EditCustom);
        w_ext1->setObjectName(QString::fromUtf8("w_ext1"));
        horizontalLayout_2 = new QHBoxLayout(w_ext1);
        horizontalLayout_2->setObjectName(QString::fromUtf8("horizontalLayout_2"));
        horizontalLayout_2->setContentsMargins(0, 0, 0, 0);
        command_l = new QLabel(w_ext1);
        command_l->setObjectName(QString::fromUtf8("command_l"));

        horizontalLayout_2->addWidget(command_l);

        command = new QLineEdit(w_ext1);
        command->setObjectName(QString::fromUtf8("command"));
        command->setPlaceholderText(QString::fromUtf8("%config%"));

        horizontalLayout_2->addWidget(command);

        config_suffix_l = new QLabel(w_ext1);
        config_suffix_l->setObjectName(QString::fromUtf8("config_suffix_l"));

        horizontalLayout_2->addWidget(config_suffix_l);

        config_suffix = new QComboBox(w_ext1);
        config_suffix->addItem(QString::fromUtf8(""));
        config_suffix->addItem(QString::fromUtf8("json"));
        config_suffix->addItem(QString::fromUtf8("yml"));
        config_suffix->setObjectName(QString::fromUtf8("config_suffix"));
        config_suffix->setEditable(true);

        horizontalLayout_2->addWidget(config_suffix);


        verticalLayout->addWidget(w_ext1);

        w_ext2 = new QWidget(EditCustom);
        w_ext2->setObjectName(QString::fromUtf8("w_ext2"));
        horizontalLayout_3 = new QHBoxLayout(w_ext2);
        horizontalLayout_3->setObjectName(QString::fromUtf8("horizontalLayout_3"));
        horizontalLayout_3->setContentsMargins(0, 0, 0, 0);
        label = new QLabel(w_ext2);
        label->setObjectName(QString::fromUtf8("label"));
        label->setText(QString::fromUtf8("Mapping Port"));

        horizontalLayout_3->addWidget(label);

        mapping_port = new QLineEdit(w_ext2);
        mapping_port->setObjectName(QString::fromUtf8("mapping_port"));

        horizontalLayout_3->addWidget(mapping_port);

        label_2 = new QLabel(w_ext2);
        label_2->setObjectName(QString::fromUtf8("label_2"));
        label_2->setText(QString::fromUtf8("Socks Port"));

        horizontalLayout_3->addWidget(label_2);

        socks_port = new QLineEdit(w_ext2);
        socks_port->setObjectName(QString::fromUtf8("socks_port"));

        horizontalLayout_3->addWidget(socks_port);

        preview = new QPushButton(w_ext2);
        preview->setObjectName(QString::fromUtf8("preview"));

        horizontalLayout_3->addWidget(preview);


        verticalLayout->addWidget(w_ext2);

        config_simple = new QPlainTextEdit(EditCustom);
        config_simple->setObjectName(QString::fromUtf8("config_simple"));
        config_simple->setMinimumSize(QSize(0, 300));

        verticalLayout->addWidget(config_simple);

        QWidget::setTabOrder(core, as_json);
        QWidget::setTabOrder(as_json, command);
        QWidget::setTabOrder(command, config_suffix);
        QWidget::setTabOrder(config_suffix, mapping_port);
        QWidget::setTabOrder(mapping_port, socks_port);
        QWidget::setTabOrder(socks_port, preview);
        QWidget::setTabOrder(preview, config_simple);

        retranslateUi(EditCustom);

        QMetaObject::connectSlotsByName(EditCustom);
    } // setupUi

    void retranslateUi(QWidget *EditCustom)
    {
        core_l->setText(QCoreApplication::translate("EditCustom", "Core", nullptr));
        as_json->setText(QCoreApplication::translate("EditCustom", "Json Editor", nullptr));
        command_l->setText(QCoreApplication::translate("EditCustom", "Command", nullptr));
        config_suffix_l->setText(QCoreApplication::translate("EditCustom", "Config Suffix", nullptr));

#if QT_CONFIG(tooltip)
        label->setToolTip(QCoreApplication::translate("EditCustom", "Random if it's empty or zero.", nullptr));
#endif // QT_CONFIG(tooltip)
#if QT_CONFIG(tooltip)
        label_2->setToolTip(QCoreApplication::translate("EditCustom", "Random if it's empty or zero.", nullptr));
#endif // QT_CONFIG(tooltip)
        preview->setText(QCoreApplication::translate("EditCustom", "Preview", nullptr));
        (void)EditCustom;
    } // retranslateUi

};

namespace Ui {
    class EditCustom: public Ui_EditCustom {};
} // namespace Ui

QT_END_NAMESPACE

#endif // UI_EDIT_CUSTOM_H

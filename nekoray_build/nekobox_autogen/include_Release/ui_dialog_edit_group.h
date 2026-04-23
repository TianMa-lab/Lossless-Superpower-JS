/********************************************************************************
** Form generated from reading UI file 'dialog_edit_group.ui'
**
** Created by: Qt User Interface Compiler version 5.15.2
**
** WARNING! All changes made in this file will be lost when recompiling UI file!
********************************************************************************/

#ifndef UI_DIALOG_EDIT_GROUP_H
#define UI_DIALOG_EDIT_GROUP_H

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
#include <QtWidgets/QLineEdit>
#include <QtWidgets/QPushButton>
#include <QtWidgets/QVBoxLayout>
#include "ui/widget/MyLineEdit.h"

QT_BEGIN_NAMESPACE

class Ui_DialogEditGroup
{
public:
    QVBoxLayout *verticalLayout;
    QGroupBox *cat_common;
    QGridLayout *main;
    QLineEdit *name;
    QLabel *label_2;
    QComboBox *type;
    QLabel *front_proxy_l;
    QHBoxLayout *horizontalLayout_2;
    QCheckBox *manually_column_width;
    QCheckBox *archive;
    QLabel *label;
    QHBoxLayout *horizontalLayout;
    QPushButton *front_proxy;
    QPushButton *front_proxy_clear;
    QGroupBox *cat_sub;
    QGridLayout *_2;
    QLabel *label_4;
    MyLineEdit *url;
    QCheckBox *skip_auto_update;
    QGroupBox *cat_share;
    QVBoxLayout *verticalLayout_2;
    QPushButton *copy_links;
    QPushButton *copy_links_nkr;
    QDialogButtonBox *buttonBox;

    void setupUi(QDialog *DialogEditGroup)
    {
        if (DialogEditGroup->objectName().isEmpty())
            DialogEditGroup->setObjectName(QString::fromUtf8("DialogEditGroup"));
        DialogEditGroup->resize(400, 468);
        DialogEditGroup->setMinimumSize(QSize(400, 300));
        verticalLayout = new QVBoxLayout(DialogEditGroup);
        verticalLayout->setObjectName(QString::fromUtf8("verticalLayout"));
        cat_common = new QGroupBox(DialogEditGroup);
        cat_common->setObjectName(QString::fromUtf8("cat_common"));
        QSizePolicy sizePolicy(QSizePolicy::Preferred, QSizePolicy::Maximum);
        sizePolicy.setHorizontalStretch(0);
        sizePolicy.setVerticalStretch(0);
        sizePolicy.setHeightForWidth(cat_common->sizePolicy().hasHeightForWidth());
        cat_common->setSizePolicy(sizePolicy);
        main = new QGridLayout(cat_common);
        main->setObjectName(QString::fromUtf8("main"));
        name = new QLineEdit(cat_common);
        name->setObjectName(QString::fromUtf8("name"));

        main->addWidget(name, 0, 1, 1, 1);

        label_2 = new QLabel(cat_common);
        label_2->setObjectName(QString::fromUtf8("label_2"));

        main->addWidget(label_2, 1, 0, 1, 1);

        type = new QComboBox(cat_common);
        type->addItem(QString());
        type->addItem(QString());
        type->setObjectName(QString::fromUtf8("type"));

        main->addWidget(type, 1, 1, 1, 1);

        front_proxy_l = new QLabel(cat_common);
        front_proxy_l->setObjectName(QString::fromUtf8("front_proxy_l"));

        main->addWidget(front_proxy_l, 2, 0, 1, 1);

        horizontalLayout_2 = new QHBoxLayout();
        horizontalLayout_2->setObjectName(QString::fromUtf8("horizontalLayout_2"));
        manually_column_width = new QCheckBox(cat_common);
        manually_column_width->setObjectName(QString::fromUtf8("manually_column_width"));

        horizontalLayout_2->addWidget(manually_column_width);

        archive = new QCheckBox(cat_common);
        archive->setObjectName(QString::fromUtf8("archive"));

        horizontalLayout_2->addWidget(archive);


        main->addLayout(horizontalLayout_2, 3, 1, 1, 1);

        label = new QLabel(cat_common);
        label->setObjectName(QString::fromUtf8("label"));

        main->addWidget(label, 0, 0, 1, 1);

        horizontalLayout = new QHBoxLayout();
        horizontalLayout->setObjectName(QString::fromUtf8("horizontalLayout"));
        front_proxy = new QPushButton(cat_common);
        front_proxy->setObjectName(QString::fromUtf8("front_proxy"));
        front_proxy->setText(QString::fromUtf8(""));

        horizontalLayout->addWidget(front_proxy);

        front_proxy_clear = new QPushButton(cat_common);
        front_proxy_clear->setObjectName(QString::fromUtf8("front_proxy_clear"));
        QSizePolicy sizePolicy1(QSizePolicy::Maximum, QSizePolicy::Fixed);
        sizePolicy1.setHorizontalStretch(0);
        sizePolicy1.setVerticalStretch(0);
        sizePolicy1.setHeightForWidth(front_proxy_clear->sizePolicy().hasHeightForWidth());
        front_proxy_clear->setSizePolicy(sizePolicy1);

        horizontalLayout->addWidget(front_proxy_clear);


        main->addLayout(horizontalLayout, 2, 1, 1, 1);


        verticalLayout->addWidget(cat_common);

        cat_sub = new QGroupBox(DialogEditGroup);
        cat_sub->setObjectName(QString::fromUtf8("cat_sub"));
        _2 = new QGridLayout(cat_sub);
        _2->setObjectName(QString::fromUtf8("_2"));
        label_4 = new QLabel(cat_sub);
        label_4->setObjectName(QString::fromUtf8("label_4"));

        _2->addWidget(label_4, 0, 0, 1, 1);

        url = new MyLineEdit(cat_sub);
        url->setObjectName(QString::fromUtf8("url"));

        _2->addWidget(url, 0, 1, 1, 1);

        skip_auto_update = new QCheckBox(cat_sub);
        skip_auto_update->setObjectName(QString::fromUtf8("skip_auto_update"));

        _2->addWidget(skip_auto_update, 1, 1, 1, 1);


        verticalLayout->addWidget(cat_sub);

        cat_share = new QGroupBox(DialogEditGroup);
        cat_share->setObjectName(QString::fromUtf8("cat_share"));
        verticalLayout_2 = new QVBoxLayout(cat_share);
        verticalLayout_2->setObjectName(QString::fromUtf8("verticalLayout_2"));
        copy_links = new QPushButton(cat_share);
        copy_links->setObjectName(QString::fromUtf8("copy_links"));

        verticalLayout_2->addWidget(copy_links);

        copy_links_nkr = new QPushButton(cat_share);
        copy_links_nkr->setObjectName(QString::fromUtf8("copy_links_nkr"));

        verticalLayout_2->addWidget(copy_links_nkr);


        verticalLayout->addWidget(cat_share);

        buttonBox = new QDialogButtonBox(DialogEditGroup);
        buttonBox->setObjectName(QString::fromUtf8("buttonBox"));
        buttonBox->setStandardButtons(QDialogButtonBox::Cancel|QDialogButtonBox::Ok);

        verticalLayout->addWidget(buttonBox);

        QWidget::setTabOrder(name, type);
        QWidget::setTabOrder(type, front_proxy);
        QWidget::setTabOrder(front_proxy, front_proxy_clear);
        QWidget::setTabOrder(front_proxy_clear, manually_column_width);
        QWidget::setTabOrder(manually_column_width, archive);
        QWidget::setTabOrder(archive, url);
        QWidget::setTabOrder(url, skip_auto_update);
        QWidget::setTabOrder(skip_auto_update, copy_links);
        QWidget::setTabOrder(copy_links, copy_links_nkr);

        retranslateUi(DialogEditGroup);
        QObject::connect(buttonBox, SIGNAL(rejected()), DialogEditGroup, SLOT(reject()));
        QObject::connect(buttonBox, SIGNAL(accepted()), DialogEditGroup, SLOT(accept()));

        QMetaObject::connectSlotsByName(DialogEditGroup);
    } // setupUi

    void retranslateUi(QDialog *DialogEditGroup)
    {
        DialogEditGroup->setWindowTitle(QCoreApplication::translate("DialogEditGroup", "Edit Group", nullptr));
        cat_common->setTitle(QCoreApplication::translate("DialogEditGroup", "Common", nullptr));
        label_2->setText(QCoreApplication::translate("DialogEditGroup", "Type", nullptr));
        type->setItemText(0, QCoreApplication::translate("DialogEditGroup", "Basic", nullptr));
        type->setItemText(1, QCoreApplication::translate("DialogEditGroup", "Subscription", nullptr));

        front_proxy_l->setText(QCoreApplication::translate("DialogEditGroup", "Front Proxy", nullptr));
        manually_column_width->setText(QCoreApplication::translate("DialogEditGroup", "Manually column width", nullptr));
        archive->setText(QCoreApplication::translate("DialogEditGroup", "Archive", nullptr));
        label->setText(QCoreApplication::translate("DialogEditGroup", "Name", nullptr));
        front_proxy_clear->setText(QCoreApplication::translate("DialogEditGroup", "Clear", nullptr));
        cat_sub->setTitle(QCoreApplication::translate("DialogEditGroup", "Subscription", nullptr));
        label_4->setText(QCoreApplication::translate("DialogEditGroup", "URL", nullptr));
        skip_auto_update->setText(QCoreApplication::translate("DialogEditGroup", "Skip automatic update", nullptr));
        cat_share->setTitle(QCoreApplication::translate("DialogEditGroup", "Share", nullptr));
        copy_links->setText(QCoreApplication::translate("DialogEditGroup", "Copy profile share links", nullptr));
        copy_links_nkr->setText(QCoreApplication::translate("DialogEditGroup", "Copy profile share links (Neko Links)", nullptr));
    } // retranslateUi

};

namespace Ui {
    class DialogEditGroup: public Ui_DialogEditGroup {};
} // namespace Ui

QT_END_NAMESPACE

#endif // UI_DIALOG_EDIT_GROUP_H

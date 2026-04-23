/********************************************************************************
** Form generated from reading UI file 'GroupItem.ui'
**
** Created by: Qt User Interface Compiler version 5.15.2
**
** WARNING! All changes made in this file will be lost when recompiling UI file!
********************************************************************************/

#ifndef UI_GROUPITEM_H
#define UI_GROUPITEM_H

#include <QtCore/QVariant>
#include <QtWidgets/QApplication>
#include <QtWidgets/QHBoxLayout>
#include <QtWidgets/QLabel>
#include <QtWidgets/QPushButton>
#include <QtWidgets/QVBoxLayout>
#include <QtWidgets/QWidget>

QT_BEGIN_NAMESPACE

class Ui_GroupItem
{
public:
    QVBoxLayout *verticalLayout;
    QHBoxLayout *horizontalLayout;
    QLabel *type;
    QLabel *name;
    QPushButton *update_sub;
    QPushButton *edit;
    QPushButton *remove;
    QLabel *url;
    QLabel *subinfo;

    void setupUi(QWidget *GroupItem)
    {
        if (GroupItem->objectName().isEmpty())
            GroupItem->setObjectName(QString::fromUtf8("GroupItem"));
        GroupItem->resize(403, 300);
        QSizePolicy sizePolicy(QSizePolicy::Minimum, QSizePolicy::Minimum);
        sizePolicy.setHorizontalStretch(0);
        sizePolicy.setVerticalStretch(0);
        sizePolicy.setHeightForWidth(GroupItem->sizePolicy().hasHeightForWidth());
        GroupItem->setSizePolicy(sizePolicy);
        GroupItem->setWindowTitle(QString::fromUtf8(""));
        verticalLayout = new QVBoxLayout(GroupItem);
        verticalLayout->setObjectName(QString::fromUtf8("verticalLayout"));
        horizontalLayout = new QHBoxLayout();
        horizontalLayout->setObjectName(QString::fromUtf8("horizontalLayout"));
        type = new QLabel(GroupItem);
        type->setObjectName(QString::fromUtf8("type"));
        QSizePolicy sizePolicy1(QSizePolicy::Maximum, QSizePolicy::Maximum);
        sizePolicy1.setHorizontalStretch(0);
        sizePolicy1.setVerticalStretch(0);
        sizePolicy1.setHeightForWidth(type->sizePolicy().hasHeightForWidth());
        type->setSizePolicy(sizePolicy1);
        type->setStyleSheet(QString::fromUtf8("color: rgb(251, 114, 153);"));
        type->setText(QString::fromUtf8("Type"));

        horizontalLayout->addWidget(type);

        name = new QLabel(GroupItem);
        name->setObjectName(QString::fromUtf8("name"));
        QSizePolicy sizePolicy2(QSizePolicy::Ignored, QSizePolicy::Maximum);
        sizePolicy2.setHorizontalStretch(0);
        sizePolicy2.setVerticalStretch(0);
        sizePolicy2.setHeightForWidth(name->sizePolicy().hasHeightForWidth());
        name->setSizePolicy(sizePolicy2);
        name->setText(QString::fromUtf8("Name"));

        horizontalLayout->addWidget(name);

        update_sub = new QPushButton(GroupItem);
        update_sub->setObjectName(QString::fromUtf8("update_sub"));
        QSizePolicy sizePolicy3(QSizePolicy::Maximum, QSizePolicy::Fixed);
        sizePolicy3.setHorizontalStretch(0);
        sizePolicy3.setVerticalStretch(0);
        sizePolicy3.setHeightForWidth(update_sub->sizePolicy().hasHeightForWidth());
        update_sub->setSizePolicy(sizePolicy3);

        horizontalLayout->addWidget(update_sub);

        edit = new QPushButton(GroupItem);
        edit->setObjectName(QString::fromUtf8("edit"));
        sizePolicy3.setHeightForWidth(edit->sizePolicy().hasHeightForWidth());
        edit->setSizePolicy(sizePolicy3);

        horizontalLayout->addWidget(edit);

        remove = new QPushButton(GroupItem);
        remove->setObjectName(QString::fromUtf8("remove"));
        sizePolicy3.setHeightForWidth(remove->sizePolicy().hasHeightForWidth());
        remove->setSizePolicy(sizePolicy3);

        horizontalLayout->addWidget(remove);


        verticalLayout->addLayout(horizontalLayout);

        url = new QLabel(GroupItem);
        url->setObjectName(QString::fromUtf8("url"));
        sizePolicy2.setHeightForWidth(url->sizePolicy().hasHeightForWidth());
        url->setSizePolicy(sizePolicy2);
        url->setStyleSheet(QString::fromUtf8("color: rgb(102, 102, 102);"));
        url->setText(QString::fromUtf8("Url"));

        verticalLayout->addWidget(url);

        subinfo = new QLabel(GroupItem);
        subinfo->setObjectName(QString::fromUtf8("subinfo"));
        QSizePolicy sizePolicy4(QSizePolicy::Preferred, QSizePolicy::Maximum);
        sizePolicy4.setHorizontalStretch(0);
        sizePolicy4.setVerticalStretch(0);
        sizePolicy4.setHeightForWidth(subinfo->sizePolicy().hasHeightForWidth());
        subinfo->setSizePolicy(sizePolicy4);
        subinfo->setText(QString::fromUtf8("\350\256\242\351\230\205\346\265\201\351\207\217\344\277\241\346\201\257"));

        verticalLayout->addWidget(subinfo);


        retranslateUi(GroupItem);

        QMetaObject::connectSlotsByName(GroupItem);
    } // setupUi

    void retranslateUi(QWidget *GroupItem)
    {
        update_sub->setText(QCoreApplication::translate("GroupItem", "Update Subscription", nullptr));
        edit->setText(QCoreApplication::translate("GroupItem", "Edit", nullptr));
        remove->setText(QCoreApplication::translate("GroupItem", "Remove", nullptr));
        (void)GroupItem;
    } // retranslateUi

};

namespace Ui {
    class GroupItem: public Ui_GroupItem {};
} // namespace Ui

QT_END_NAMESPACE

#endif // UI_GROUPITEM_H

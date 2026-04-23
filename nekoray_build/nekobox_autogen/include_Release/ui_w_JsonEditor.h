/********************************************************************************
** Form generated from reading UI file 'w_JsonEditor.ui'
**
** Created by: Qt User Interface Compiler version 5.15.2
**
** WARNING! All changes made in this file will be lost when recompiling UI file!
********************************************************************************/

#ifndef UI_W_JSONEDITOR_H
#define UI_W_JSONEDITOR_H

#include <QtCore/QVariant>
#include <QtWidgets/QApplication>
#include <QtWidgets/QDialog>
#include <QtWidgets/QDialogButtonBox>
#include <QtWidgets/QGridLayout>
#include <QtWidgets/QHeaderView>
#include <QtWidgets/QLabel>
#include <QtWidgets/QPushButton>
#include <QtWidgets/QSplitter>
#include <QtWidgets/QTextEdit>
#include <QtWidgets/QTreeView>
#include <QtWidgets/QWidget>

QT_BEGIN_NAMESPACE

class Ui_JsonEditor
{
public:
    QGridLayout *gridLayout_3;
    QSplitter *splitter;
    QWidget *layoutWidgetx;
    QGridLayout *gridLayout;
    QTextEdit *jsonEditor;
    QPushButton *formatJsonBtn;
    QPushButton *removeCommentsBtn;
    QLabel *label;
    QWidget *layoutWidget;
    QGridLayout *gridLayout_2;
    QLabel *label_2;
    QTreeView *jsonTree;
    QLabel *jsonValidateStatus;
    QDialogButtonBox *buttonBox;

    void setupUi(QDialog *JsonEditor)
    {
        if (JsonEditor->objectName().isEmpty())
            JsonEditor->setObjectName(QString::fromUtf8("JsonEditor"));
        JsonEditor->setWindowModality(Qt::ApplicationModal);
        JsonEditor->resize(889, 572);
        JsonEditor->setModal(true);
        gridLayout_3 = new QGridLayout(JsonEditor);
        gridLayout_3->setObjectName(QString::fromUtf8("gridLayout_3"));
        splitter = new QSplitter(JsonEditor);
        splitter->setObjectName(QString::fromUtf8("splitter"));
        splitter->setOrientation(Qt::Horizontal);
        splitter->setChildrenCollapsible(false);
        layoutWidgetx = new QWidget(splitter);
        layoutWidgetx->setObjectName(QString::fromUtf8("layoutWidgetx"));
        gridLayout = new QGridLayout(layoutWidgetx);
        gridLayout->setObjectName(QString::fromUtf8("gridLayout"));
        gridLayout->setContentsMargins(0, 0, 0, 0);
        jsonEditor = new QTextEdit(layoutWidgetx);
        jsonEditor->setObjectName(QString::fromUtf8("jsonEditor"));
        QFont font;
        font.setFamily(QString::fromUtf8("Monospace"));
        jsonEditor->setFont(font);
        jsonEditor->setLineWrapMode(QTextEdit::NoWrap);
        jsonEditor->setAcceptRichText(false);

        gridLayout->addWidget(jsonEditor, 1, 0, 1, 2);

        formatJsonBtn = new QPushButton(layoutWidgetx);
        formatJsonBtn->setObjectName(QString::fromUtf8("formatJsonBtn"));

        gridLayout->addWidget(formatJsonBtn, 2, 0, 1, 1);

        removeCommentsBtn = new QPushButton(layoutWidgetx);
        removeCommentsBtn->setObjectName(QString::fromUtf8("removeCommentsBtn"));

        gridLayout->addWidget(removeCommentsBtn, 2, 1, 1, 1);

        label = new QLabel(layoutWidgetx);
        label->setObjectName(QString::fromUtf8("label"));

        gridLayout->addWidget(label, 0, 0, 1, 2);

        splitter->addWidget(layoutWidgetx);
        layoutWidget = new QWidget(splitter);
        layoutWidget->setObjectName(QString::fromUtf8("layoutWidget"));
        gridLayout_2 = new QGridLayout(layoutWidget);
        gridLayout_2->setObjectName(QString::fromUtf8("gridLayout_2"));
        gridLayout_2->setContentsMargins(0, 0, 0, 0);
        label_2 = new QLabel(layoutWidget);
        label_2->setObjectName(QString::fromUtf8("label_2"));

        gridLayout_2->addWidget(label_2, 0, 0, 1, 1);

        jsonTree = new QTreeView(layoutWidget);
        jsonTree->setObjectName(QString::fromUtf8("jsonTree"));
        jsonTree->setEditTriggers(QAbstractItemView::NoEditTriggers);
        jsonTree->setAlternatingRowColors(true);
        jsonTree->setIndentation(15);
        jsonTree->setUniformRowHeights(true);
        jsonTree->setAllColumnsShowFocus(true);
        jsonTree->header()->setCascadingSectionResizes(true);
        jsonTree->header()->setMinimumSectionSize(132);
        jsonTree->header()->setDefaultSectionSize(152);

        gridLayout_2->addWidget(jsonTree, 1, 0, 1, 1);

        splitter->addWidget(layoutWidget);

        gridLayout_3->addWidget(splitter, 0, 0, 1, 2);

        jsonValidateStatus = new QLabel(JsonEditor);
        jsonValidateStatus->setObjectName(QString::fromUtf8("jsonValidateStatus"));

        gridLayout_3->addWidget(jsonValidateStatus, 1, 0, 1, 1);

        buttonBox = new QDialogButtonBox(JsonEditor);
        buttonBox->setObjectName(QString::fromUtf8("buttonBox"));
        buttonBox->setOrientation(Qt::Horizontal);
        buttonBox->setStandardButtons(QDialogButtonBox::Cancel|QDialogButtonBox::Ok);

        gridLayout_3->addWidget(buttonBox, 1, 1, 1, 1);

        QWidget::setTabOrder(jsonEditor, formatJsonBtn);
        QWidget::setTabOrder(formatJsonBtn, removeCommentsBtn);
        QWidget::setTabOrder(removeCommentsBtn, jsonTree);

        retranslateUi(JsonEditor);
        QObject::connect(buttonBox, SIGNAL(accepted()), JsonEditor, SLOT(accept()));
        QObject::connect(buttonBox, SIGNAL(rejected()), JsonEditor, SLOT(reject()));

        QMetaObject::connectSlotsByName(JsonEditor);
    } // setupUi

    void retranslateUi(QDialog *JsonEditor)
    {
        JsonEditor->setWindowTitle(QCoreApplication::translate("JsonEditor", "JSON Editor", nullptr));
        formatJsonBtn->setText(QCoreApplication::translate("JsonEditor", "Format JSON", nullptr));
        removeCommentsBtn->setText(QCoreApplication::translate("JsonEditor", "Remove All Comments", nullptr));
        label->setText(QCoreApplication::translate("JsonEditor", "Json Editor", nullptr));
        label_2->setText(QCoreApplication::translate("JsonEditor", "Structure Preview", nullptr));
        jsonValidateStatus->setText(QCoreApplication::translate("JsonEditor", "OK", nullptr));
    } // retranslateUi

};

namespace Ui {
    class JsonEditor: public Ui_JsonEditor {};
} // namespace Ui

QT_END_NAMESPACE

#endif // UI_W_JSONEDITOR_H

/********************************************************************************
** Form generated from reading UI file 'mainwindow.ui'
**
** Created by: Qt User Interface Compiler version 5.15.2
**
** WARNING! All changes made in this file will be lost when recompiling UI file!
********************************************************************************/

#ifndef UI_MAINWINDOW_H
#define UI_MAINWINDOW_H

#include <QtCore/QVariant>
#include <QtGui/QIcon>
#include <QtWidgets/QAction>
#include <QtWidgets/QApplication>
#include <QtWidgets/QCheckBox>
#include <QtWidgets/QGridLayout>
#include <QtWidgets/QHBoxLayout>
#include <QtWidgets/QHeaderView>
#include <QtWidgets/QLabel>
#include <QtWidgets/QLineEdit>
#include <QtWidgets/QMainWindow>
#include <QtWidgets/QMenu>
#include <QtWidgets/QMenuBar>
#include <QtWidgets/QSpacerItem>
#include <QtWidgets/QSplitter>
#include <QtWidgets/QTabWidget>
#include <QtWidgets/QTableWidget>
#include <QtWidgets/QTextBrowser>
#include <QtWidgets/QToolButton>
#include <QtWidgets/QVBoxLayout>
#include <QtWidgets/QWidget>
#include "ui/widget/MyTableWidget.h"

QT_BEGIN_NAMESPACE

class Ui_MainWindow
{
public:
    QAction *menu_exit;
    QAction *actionShow_window;
    QAction *menu_basic_settings;
    QAction *menu_add_from_input;
    QAction *menu_manage_groups;
    QAction *menu_start;
    QAction *menu_stop;
    QAction *menu_routing_settings;
    QAction *menu_add_from_clipboard;
    QAction *menu_delete;
    QAction *menu_add_from_clipboard2;
    QAction *menu_profile_debug_info;
    QAction *menu_qr;
    QAction *menu_copy_link;
    QAction *menu_tcp_ping;
    QAction *menu_url_test;
    QAction *menu_clear_test_result;
    QAction *menu_export_config;
    QAction *menu_reset_traffic;
    QAction *menu_scan_qr;
    QAction *menu_spmode_system_proxy;
    QAction *menu_spmode_disabled;
    QAction *menu_delete_repeat;
    QAction *actionfake;
    QAction *menu_move;
    QAction *actionStart_with_system;
    QAction *actionRemember_last_proxy;
    QAction *actionAllow_LAN;
    QAction *menu_remove_unavailable;
    QAction *menu_full_test;
    QAction *menu_hotkey_settings;
    QAction *menu_select_all;
    QAction *menu_copy_links_nkr;
    QAction *actionfake_2;
    QAction *actionfake_3;
    QAction *menu_copy_links;
    QAction *menu_spmode_vpn;
    QAction *menu_clone;
    QAction *menu_update_subscription;
    QAction *menu_resolve_domain;
    QAction *menu_vpn_settings;
    QAction *actionRestart_Program;
    QAction *menu_open_config_folder;
    QAction *actionfake_4;
    QAction *actionfake_5;
    QAction *actionRestart_Proxy;
    QAction *menu_stop_testing;
    QWidget *centralwidget;
    QVBoxLayout *verticalLayout_3;
    QHBoxLayout *horizontalLayout_2;
    QToolButton *toolButton_program;
    QToolButton *toolButton_preferences;
    QToolButton *toolButton_server;
    QToolButton *toolButton_ads;
    QToolButton *toolButton_document;
    QToolButton *toolButton_update;
    QVBoxLayout *verticalLayout_4;
    QCheckBox *checkBox_VPN;
    QCheckBox *checkBox_SystemProxy;
    QSpacerItem *horizontalSpacer;
    QLineEdit *search;
    QToolButton *toolButton_url_test;
    QSplitter *splitter;
    QTabWidget *tabWidget;
    QWidget *widget1;
    QGridLayout *gridLayout_2;
    MyTableWidget *proxyListTable;
    QWidget *aaaaaaaaaaaaaaaaaa;
    QVBoxLayout *aaaaaaaaaaaa;
    QTabWidget *down_tab;
    QWidget *tab;
    QVBoxLayout *verticalLayout;
    QTextBrowser *masterLogBrowser;
    QWidget *tab_2;
    QVBoxLayout *verticalLayout_2;
    QTableWidget *tableWidget_conn;
    QHBoxLayout *horizontalLayout;
    QLabel *label_running;
    QSpacerItem *horizontalSpacer_2;
    QLabel *label_inbound;
    QLabel *label_speed;
    QMenuBar *menubar;
    QMenu *menu_program;
    QMenu *menu_spmode;
    QMenu *menu_program_preference;
    QMenu *menuActive_Server;
    QMenu *menuActive_Routing;
    QMenu *menu_preferences;
    QMenu *menu_server;
    QMenu *menu_share_item;
    QMenu *menuCurrent_Group;
    QMenu *menuCurrent_Select;

    void setupUi(QMainWindow *MainWindow)
    {
        if (MainWindow->objectName().isEmpty())
            MainWindow->setObjectName(QString::fromUtf8("MainWindow"));
        MainWindow->resize(800, 600);
        MainWindow->setMinimumSize(QSize(800, 600));
        MainWindow->setWindowTitle(QString::fromUtf8("nya"));
        menu_exit = new QAction(MainWindow);
        menu_exit->setObjectName(QString::fromUtf8("menu_exit"));
        actionShow_window = new QAction(MainWindow);
        actionShow_window->setObjectName(QString::fromUtf8("actionShow_window"));
        menu_basic_settings = new QAction(MainWindow);
        menu_basic_settings->setObjectName(QString::fromUtf8("menu_basic_settings"));
        menu_add_from_input = new QAction(MainWindow);
        menu_add_from_input->setObjectName(QString::fromUtf8("menu_add_from_input"));
        menu_manage_groups = new QAction(MainWindow);
        menu_manage_groups->setObjectName(QString::fromUtf8("menu_manage_groups"));
        menu_start = new QAction(MainWindow);
        menu_start->setObjectName(QString::fromUtf8("menu_start"));
#if QT_CONFIG(shortcut)
        menu_start->setShortcut(QString::fromUtf8("Return"));
#endif // QT_CONFIG(shortcut)
        menu_stop = new QAction(MainWindow);
        menu_stop->setObjectName(QString::fromUtf8("menu_stop"));
#if QT_CONFIG(shortcut)
        menu_stop->setShortcut(QString::fromUtf8("Ctrl+S"));
#endif // QT_CONFIG(shortcut)
        menu_routing_settings = new QAction(MainWindow);
        menu_routing_settings->setObjectName(QString::fromUtf8("menu_routing_settings"));
        menu_add_from_clipboard = new QAction(MainWindow);
        menu_add_from_clipboard->setObjectName(QString::fromUtf8("menu_add_from_clipboard"));
#if QT_CONFIG(shortcut)
        menu_add_from_clipboard->setShortcut(QString::fromUtf8("Ctrl+V"));
#endif // QT_CONFIG(shortcut)
        menu_delete = new QAction(MainWindow);
        menu_delete->setObjectName(QString::fromUtf8("menu_delete"));
#if QT_CONFIG(shortcut)
        menu_delete->setShortcut(QString::fromUtf8("Del"));
#endif // QT_CONFIG(shortcut)
        menu_add_from_clipboard2 = new QAction(MainWindow);
        menu_add_from_clipboard2->setObjectName(QString::fromUtf8("menu_add_from_clipboard2"));
        menu_profile_debug_info = new QAction(MainWindow);
        menu_profile_debug_info->setObjectName(QString::fromUtf8("menu_profile_debug_info"));
        menu_qr = new QAction(MainWindow);
        menu_qr->setObjectName(QString::fromUtf8("menu_qr"));
#if QT_CONFIG(shortcut)
        menu_qr->setShortcut(QString::fromUtf8("Ctrl+Q"));
#endif // QT_CONFIG(shortcut)
        menu_copy_link = new QAction(MainWindow);
        menu_copy_link->setObjectName(QString::fromUtf8("menu_copy_link"));
        menu_tcp_ping = new QAction(MainWindow);
        menu_tcp_ping->setObjectName(QString::fromUtf8("menu_tcp_ping"));
        menu_tcp_ping->setText(QString::fromUtf8("Tcp Ping"));
#if QT_CONFIG(shortcut)
        menu_tcp_ping->setShortcut(QString::fromUtf8("Ctrl+Alt+T"));
#endif // QT_CONFIG(shortcut)
        menu_url_test = new QAction(MainWindow);
        menu_url_test->setObjectName(QString::fromUtf8("menu_url_test"));
        menu_url_test->setText(QString::fromUtf8("Url Test"));
#if QT_CONFIG(shortcut)
        menu_url_test->setShortcut(QString::fromUtf8("Ctrl+Alt+U"));
#endif // QT_CONFIG(shortcut)
        menu_clear_test_result = new QAction(MainWindow);
        menu_clear_test_result->setObjectName(QString::fromUtf8("menu_clear_test_result"));
#if QT_CONFIG(shortcut)
        menu_clear_test_result->setShortcut(QString::fromUtf8("Ctrl+Alt+C"));
#endif // QT_CONFIG(shortcut)
        menu_export_config = new QAction(MainWindow);
        menu_export_config->setObjectName(QString::fromUtf8("menu_export_config"));
#if QT_CONFIG(shortcut)
        menu_export_config->setShortcut(QString::fromUtf8("Ctrl+E"));
#endif // QT_CONFIG(shortcut)
        menu_reset_traffic = new QAction(MainWindow);
        menu_reset_traffic->setObjectName(QString::fromUtf8("menu_reset_traffic"));
#if QT_CONFIG(shortcut)
        menu_reset_traffic->setShortcut(QString::fromUtf8("Ctrl+R"));
#endif // QT_CONFIG(shortcut)
        menu_scan_qr = new QAction(MainWindow);
        menu_scan_qr->setObjectName(QString::fromUtf8("menu_scan_qr"));
        menu_spmode_system_proxy = new QAction(MainWindow);
        menu_spmode_system_proxy->setObjectName(QString::fromUtf8("menu_spmode_system_proxy"));
        menu_spmode_system_proxy->setCheckable(true);
        menu_spmode_disabled = new QAction(MainWindow);
        menu_spmode_disabled->setObjectName(QString::fromUtf8("menu_spmode_disabled"));
        menu_spmode_disabled->setCheckable(true);
        menu_delete_repeat = new QAction(MainWindow);
        menu_delete_repeat->setObjectName(QString::fromUtf8("menu_delete_repeat"));
#if QT_CONFIG(shortcut)
        menu_delete_repeat->setShortcut(QString::fromUtf8("Ctrl+Alt+D"));
#endif // QT_CONFIG(shortcut)
        actionfake = new QAction(MainWindow);
        actionfake->setObjectName(QString::fromUtf8("actionfake"));
        actionfake->setVisible(false);
        menu_move = new QAction(MainWindow);
        menu_move->setObjectName(QString::fromUtf8("menu_move"));
#if QT_CONFIG(shortcut)
        menu_move->setShortcut(QString::fromUtf8("Ctrl+M"));
#endif // QT_CONFIG(shortcut)
        actionStart_with_system = new QAction(MainWindow);
        actionStart_with_system->setObjectName(QString::fromUtf8("actionStart_with_system"));
        actionStart_with_system->setCheckable(true);
        actionRemember_last_proxy = new QAction(MainWindow);
        actionRemember_last_proxy->setObjectName(QString::fromUtf8("actionRemember_last_proxy"));
        actionRemember_last_proxy->setCheckable(true);
        actionAllow_LAN = new QAction(MainWindow);
        actionAllow_LAN->setObjectName(QString::fromUtf8("actionAllow_LAN"));
        actionAllow_LAN->setCheckable(true);
        menu_remove_unavailable = new QAction(MainWindow);
        menu_remove_unavailable->setObjectName(QString::fromUtf8("menu_remove_unavailable"));
#if QT_CONFIG(shortcut)
        menu_remove_unavailable->setShortcut(QString::fromUtf8("Ctrl+Alt+R"));
#endif // QT_CONFIG(shortcut)
        menu_full_test = new QAction(MainWindow);
        menu_full_test->setObjectName(QString::fromUtf8("menu_full_test"));
#if QT_CONFIG(shortcut)
        menu_full_test->setShortcut(QString::fromUtf8("Ctrl+Alt+F"));
#endif // QT_CONFIG(shortcut)
        menu_hotkey_settings = new QAction(MainWindow);
        menu_hotkey_settings->setObjectName(QString::fromUtf8("menu_hotkey_settings"));
        menu_select_all = new QAction(MainWindow);
        menu_select_all->setObjectName(QString::fromUtf8("menu_select_all"));
#if QT_CONFIG(shortcut)
        menu_select_all->setShortcut(QString::fromUtf8("Ctrl+A"));
#endif // QT_CONFIG(shortcut)
        menu_copy_links_nkr = new QAction(MainWindow);
        menu_copy_links_nkr->setObjectName(QString::fromUtf8("menu_copy_links_nkr"));
#if QT_CONFIG(shortcut)
        menu_copy_links_nkr->setShortcut(QString::fromUtf8("Ctrl+N"));
#endif // QT_CONFIG(shortcut)
        actionfake_2 = new QAction(MainWindow);
        actionfake_2->setObjectName(QString::fromUtf8("actionfake_2"));
        actionfake_2->setVisible(false);
        actionfake_3 = new QAction(MainWindow);
        actionfake_3->setObjectName(QString::fromUtf8("actionfake_3"));
        actionfake_3->setVisible(false);
        menu_copy_links = new QAction(MainWindow);
        menu_copy_links->setObjectName(QString::fromUtf8("menu_copy_links"));
#if QT_CONFIG(shortcut)
        menu_copy_links->setShortcut(QString::fromUtf8("Ctrl+C"));
#endif // QT_CONFIG(shortcut)
        menu_spmode_vpn = new QAction(MainWindow);
        menu_spmode_vpn->setObjectName(QString::fromUtf8("menu_spmode_vpn"));
        menu_spmode_vpn->setCheckable(true);
        menu_clone = new QAction(MainWindow);
        menu_clone->setObjectName(QString::fromUtf8("menu_clone"));
#if QT_CONFIG(shortcut)
        menu_clone->setShortcut(QString::fromUtf8("Ctrl+D"));
#endif // QT_CONFIG(shortcut)
        menu_update_subscription = new QAction(MainWindow);
        menu_update_subscription->setObjectName(QString::fromUtf8("menu_update_subscription"));
#if QT_CONFIG(shortcut)
        menu_update_subscription->setShortcut(QString::fromUtf8("Ctrl+U"));
#endif // QT_CONFIG(shortcut)
        menu_resolve_domain = new QAction(MainWindow);
        menu_resolve_domain->setObjectName(QString::fromUtf8("menu_resolve_domain"));
#if QT_CONFIG(shortcut)
        menu_resolve_domain->setShortcut(QString::fromUtf8("Ctrl+Alt+I"));
#endif // QT_CONFIG(shortcut)
        menu_vpn_settings = new QAction(MainWindow);
        menu_vpn_settings->setObjectName(QString::fromUtf8("menu_vpn_settings"));
        actionRestart_Program = new QAction(MainWindow);
        actionRestart_Program->setObjectName(QString::fromUtf8("actionRestart_Program"));
        menu_open_config_folder = new QAction(MainWindow);
        menu_open_config_folder->setObjectName(QString::fromUtf8("menu_open_config_folder"));
        actionfake_4 = new QAction(MainWindow);
        actionfake_4->setObjectName(QString::fromUtf8("actionfake_4"));
        actionfake_4->setText(QString::fromUtf8("fake"));
        actionfake_4->setVisible(false);
        actionfake_5 = new QAction(MainWindow);
        actionfake_5->setObjectName(QString::fromUtf8("actionfake_5"));
        actionfake_5->setText(QString::fromUtf8("fake"));
        actionfake_5->setVisible(false);
        actionRestart_Proxy = new QAction(MainWindow);
        actionRestart_Proxy->setObjectName(QString::fromUtf8("actionRestart_Proxy"));
        menu_stop_testing = new QAction(MainWindow);
        menu_stop_testing->setObjectName(QString::fromUtf8("menu_stop_testing"));
#if QT_CONFIG(shortcut)
        menu_stop_testing->setShortcut(QString::fromUtf8("Ctrl+Alt+S"));
#endif // QT_CONFIG(shortcut)
        centralwidget = new QWidget(MainWindow);
        centralwidget->setObjectName(QString::fromUtf8("centralwidget"));
        verticalLayout_3 = new QVBoxLayout(centralwidget);
        verticalLayout_3->setObjectName(QString::fromUtf8("verticalLayout_3"));
        horizontalLayout_2 = new QHBoxLayout();
        horizontalLayout_2->setObjectName(QString::fromUtf8("horizontalLayout_2"));
        toolButton_program = new QToolButton(centralwidget);
        toolButton_program->setObjectName(QString::fromUtf8("toolButton_program"));
        QIcon icon;
        QString iconThemeName = QString::fromUtf8("b-system-run");
        if (QIcon::hasThemeIcon(iconThemeName)) {
            icon = QIcon::fromTheme(iconThemeName);
        } else {
            icon.addFile(QString::fromUtf8("."), QSize(), QIcon::Normal, QIcon::Off);
        }
        toolButton_program->setIcon(icon);
        toolButton_program->setIconSize(QSize(24, 24));
        toolButton_program->setPopupMode(QToolButton::InstantPopup);
        toolButton_program->setToolButtonStyle(Qt::ToolButtonTextUnderIcon);

        horizontalLayout_2->addWidget(toolButton_program);

        toolButton_preferences = new QToolButton(centralwidget);
        toolButton_preferences->setObjectName(QString::fromUtf8("toolButton_preferences"));
        QIcon icon1;
        iconThemeName = QString::fromUtf8("b-preferences");
        if (QIcon::hasThemeIcon(iconThemeName)) {
            icon1 = QIcon::fromTheme(iconThemeName);
        } else {
            icon1.addFile(QString::fromUtf8("."), QSize(), QIcon::Normal, QIcon::Off);
        }
        toolButton_preferences->setIcon(icon1);
        toolButton_preferences->setIconSize(QSize(24, 24));
        toolButton_preferences->setPopupMode(QToolButton::InstantPopup);
        toolButton_preferences->setToolButtonStyle(Qt::ToolButtonTextUnderIcon);

        horizontalLayout_2->addWidget(toolButton_preferences);

        toolButton_server = new QToolButton(centralwidget);
        toolButton_server->setObjectName(QString::fromUtf8("toolButton_server"));
        QIcon icon2;
        iconThemeName = QString::fromUtf8("b-network-server");
        if (QIcon::hasThemeIcon(iconThemeName)) {
            icon2 = QIcon::fromTheme(iconThemeName);
        } else {
            icon2.addFile(QString::fromUtf8("."), QSize(), QIcon::Normal, QIcon::Off);
        }
        toolButton_server->setIcon(icon2);
        toolButton_server->setIconSize(QSize(24, 24));
        toolButton_server->setPopupMode(QToolButton::InstantPopup);
        toolButton_server->setToolButtonStyle(Qt::ToolButtonTextUnderIcon);

        horizontalLayout_2->addWidget(toolButton_server);

        toolButton_ads = new QToolButton(centralwidget);
        toolButton_ads->setObjectName(QString::fromUtf8("toolButton_ads"));
        QIcon icon3;
        iconThemeName = QString::fromUtf8("b-internet-web-browser");
        if (QIcon::hasThemeIcon(iconThemeName)) {
            icon3 = QIcon::fromTheme(iconThemeName);
        } else {
            icon3.addFile(QString::fromUtf8("."), QSize(), QIcon::Normal, QIcon::Off);
        }
        toolButton_ads->setIcon(icon3);
        toolButton_ads->setIconSize(QSize(24, 24));
        toolButton_ads->setPopupMode(QToolButton::InstantPopup);
        toolButton_ads->setToolButtonStyle(Qt::ToolButtonTextUnderIcon);

        horizontalLayout_2->addWidget(toolButton_ads);

        toolButton_document = new QToolButton(centralwidget);
        toolButton_document->setObjectName(QString::fromUtf8("toolButton_document"));
        QIcon icon4;
        iconThemeName = QString::fromUtf8("b-dialog-question");
        if (QIcon::hasThemeIcon(iconThemeName)) {
            icon4 = QIcon::fromTheme(iconThemeName);
        } else {
            icon4.addFile(QString::fromUtf8("."), QSize(), QIcon::Normal, QIcon::Off);
        }
        toolButton_document->setIcon(icon4);
        toolButton_document->setIconSize(QSize(24, 24));
        toolButton_document->setPopupMode(QToolButton::InstantPopup);
        toolButton_document->setToolButtonStyle(Qt::ToolButtonTextUnderIcon);

        horizontalLayout_2->addWidget(toolButton_document);

        toolButton_update = new QToolButton(centralwidget);
        toolButton_update->setObjectName(QString::fromUtf8("toolButton_update"));
        QIcon icon5;
        iconThemeName = QString::fromUtf8("b-system-software-update");
        if (QIcon::hasThemeIcon(iconThemeName)) {
            icon5 = QIcon::fromTheme(iconThemeName);
        } else {
            icon5.addFile(QString::fromUtf8("."), QSize(), QIcon::Normal, QIcon::Off);
        }
        toolButton_update->setIcon(icon5);
        toolButton_update->setIconSize(QSize(24, 24));
        toolButton_update->setPopupMode(QToolButton::InstantPopup);
        toolButton_update->setToolButtonStyle(Qt::ToolButtonTextUnderIcon);

        horizontalLayout_2->addWidget(toolButton_update);

        verticalLayout_4 = new QVBoxLayout();
        verticalLayout_4->setObjectName(QString::fromUtf8("verticalLayout_4"));
        checkBox_VPN = new QCheckBox(centralwidget);
        checkBox_VPN->setObjectName(QString::fromUtf8("checkBox_VPN"));
        QSizePolicy sizePolicy(QSizePolicy::Minimum, QSizePolicy::Minimum);
        sizePolicy.setHorizontalStretch(0);
        sizePolicy.setVerticalStretch(0);
        sizePolicy.setHeightForWidth(checkBox_VPN->sizePolicy().hasHeightForWidth());
        checkBox_VPN->setSizePolicy(sizePolicy);

        verticalLayout_4->addWidget(checkBox_VPN);

        checkBox_SystemProxy = new QCheckBox(centralwidget);
        checkBox_SystemProxy->setObjectName(QString::fromUtf8("checkBox_SystemProxy"));

        verticalLayout_4->addWidget(checkBox_SystemProxy);


        horizontalLayout_2->addLayout(verticalLayout_4);

        horizontalSpacer = new QSpacerItem(40, 20, QSizePolicy::Expanding, QSizePolicy::Minimum);

        horizontalLayout_2->addItem(horizontalSpacer);

        search = new QLineEdit(centralwidget);
        search->setObjectName(QString::fromUtf8("search"));
        search->setClearButtonEnabled(true);

        horizontalLayout_2->addWidget(search);

        toolButton_url_test = new QToolButton(centralwidget);
        toolButton_url_test->setObjectName(QString::fromUtf8("toolButton_url_test"));
        toolButton_url_test->setPopupMode(QToolButton::InstantPopup);
        toolButton_url_test->setToolButtonStyle(Qt::ToolButtonTextUnderIcon);

        horizontalLayout_2->addWidget(toolButton_url_test);


        verticalLayout_3->addLayout(horizontalLayout_2);

        splitter = new QSplitter(centralwidget);
        splitter->setObjectName(QString::fromUtf8("splitter"));
        splitter->setOrientation(Qt::Vertical);
        tabWidget = new QTabWidget(splitter);
        tabWidget->setObjectName(QString::fromUtf8("tabWidget"));
        tabWidget->setMovable(true);
        widget1 = new QWidget();
        widget1->setObjectName(QString::fromUtf8("widget1"));
        gridLayout_2 = new QGridLayout(widget1);
        gridLayout_2->setSpacing(0);
        gridLayout_2->setObjectName(QString::fromUtf8("gridLayout_2"));
        gridLayout_2->setContentsMargins(0, 0, 0, 0);
        proxyListTable = new MyTableWidget(widget1);
        if (proxyListTable->columnCount() < 5)
            proxyListTable->setColumnCount(5);
        QTableWidgetItem *__qtablewidgetitem = new QTableWidgetItem();
        proxyListTable->setHorizontalHeaderItem(0, __qtablewidgetitem);
        QTableWidgetItem *__qtablewidgetitem1 = new QTableWidgetItem();
        proxyListTable->setHorizontalHeaderItem(1, __qtablewidgetitem1);
        QTableWidgetItem *__qtablewidgetitem2 = new QTableWidgetItem();
        proxyListTable->setHorizontalHeaderItem(2, __qtablewidgetitem2);
        QTableWidgetItem *__qtablewidgetitem3 = new QTableWidgetItem();
        proxyListTable->setHorizontalHeaderItem(3, __qtablewidgetitem3);
        QTableWidgetItem *__qtablewidgetitem4 = new QTableWidgetItem();
        proxyListTable->setHorizontalHeaderItem(4, __qtablewidgetitem4);
        proxyListTable->setObjectName(QString::fromUtf8("proxyListTable"));
        proxyListTable->setContextMenuPolicy(Qt::CustomContextMenu);
        proxyListTable->setEditTriggers(QAbstractItemView::NoEditTriggers);
        proxyListTable->setAlternatingRowColors(true);
        proxyListTable->setSelectionBehavior(QAbstractItemView::SelectRows);
        proxyListTable->setHorizontalScrollMode(QAbstractItemView::ScrollPerPixel);
        proxyListTable->setWordWrap(false);
        proxyListTable->horizontalHeader()->setMinimumSectionSize(16);
        proxyListTable->horizontalHeader()->setHighlightSections(false);
        proxyListTable->horizontalHeader()->setProperty("showSortIndicator", QVariant(false));
        proxyListTable->verticalHeader()->setDefaultSectionSize(30);

        gridLayout_2->addWidget(proxyListTable, 0, 0, 1, 1);

        tabWidget->addTab(widget1, QString());
        splitter->addWidget(tabWidget);
        aaaaaaaaaaaaaaaaaa = new QWidget(splitter);
        aaaaaaaaaaaaaaaaaa->setObjectName(QString::fromUtf8("aaaaaaaaaaaaaaaaaa"));
        aaaaaaaaaaaa = new QVBoxLayout(aaaaaaaaaaaaaaaaaa);
        aaaaaaaaaaaa->setObjectName(QString::fromUtf8("aaaaaaaaaaaa"));
        aaaaaaaaaaaa->setContentsMargins(0, 0, 0, 0);
        down_tab = new QTabWidget(aaaaaaaaaaaaaaaaaa);
        down_tab->setObjectName(QString::fromUtf8("down_tab"));
        tab = new QWidget();
        tab->setObjectName(QString::fromUtf8("tab"));
        verticalLayout = new QVBoxLayout(tab);
        verticalLayout->setSpacing(0);
        verticalLayout->setObjectName(QString::fromUtf8("verticalLayout"));
        verticalLayout->setContentsMargins(0, 0, 0, 0);
        masterLogBrowser = new QTextBrowser(tab);
        masterLogBrowser->setObjectName(QString::fromUtf8("masterLogBrowser"));
        masterLogBrowser->setContextMenuPolicy(Qt::CustomContextMenu);
        masterLogBrowser->setOpenLinks(false);

        verticalLayout->addWidget(masterLogBrowser);

        down_tab->addTab(tab, QString());
        tab_2 = new QWidget();
        tab_2->setObjectName(QString::fromUtf8("tab_2"));
        verticalLayout_2 = new QVBoxLayout(tab_2);
        verticalLayout_2->setSpacing(0);
        verticalLayout_2->setObjectName(QString::fromUtf8("verticalLayout_2"));
        verticalLayout_2->setContentsMargins(0, 0, 0, 0);
        tableWidget_conn = new QTableWidget(tab_2);
        if (tableWidget_conn->columnCount() < 3)
            tableWidget_conn->setColumnCount(3);
        QTableWidgetItem *__qtablewidgetitem5 = new QTableWidgetItem();
        tableWidget_conn->setHorizontalHeaderItem(0, __qtablewidgetitem5);
        QTableWidgetItem *__qtablewidgetitem6 = new QTableWidgetItem();
        tableWidget_conn->setHorizontalHeaderItem(1, __qtablewidgetitem6);
        QTableWidgetItem *__qtablewidgetitem7 = new QTableWidgetItem();
        tableWidget_conn->setHorizontalHeaderItem(2, __qtablewidgetitem7);
        tableWidget_conn->setObjectName(QString::fromUtf8("tableWidget_conn"));
        tableWidget_conn->setContextMenuPolicy(Qt::CustomContextMenu);
        tableWidget_conn->setEditTriggers(QAbstractItemView::NoEditTriggers);
        tableWidget_conn->setSelectionBehavior(QAbstractItemView::SelectRows);
        tableWidget_conn->setVerticalScrollMode(QAbstractItemView::ScrollPerPixel);
        tableWidget_conn->setHorizontalScrollMode(QAbstractItemView::ScrollPerPixel);
        tableWidget_conn->horizontalHeader()->setHighlightSections(false);

        verticalLayout_2->addWidget(tableWidget_conn);

        down_tab->addTab(tab_2, QString());

        aaaaaaaaaaaa->addWidget(down_tab);

        splitter->addWidget(aaaaaaaaaaaaaaaaaa);

        verticalLayout_3->addWidget(splitter);

        horizontalLayout = new QHBoxLayout();
        horizontalLayout->setObjectName(QString::fromUtf8("horizontalLayout"));
        label_running = new QLabel(centralwidget);
        label_running->setObjectName(QString::fromUtf8("label_running"));

        horizontalLayout->addWidget(label_running);

        horizontalSpacer_2 = new QSpacerItem(0, 20, QSizePolicy::Maximum, QSizePolicy::Minimum);

        horizontalLayout->addItem(horizontalSpacer_2);

        label_inbound = new QLabel(centralwidget);
        label_inbound->setObjectName(QString::fromUtf8("label_inbound"));

        horizontalLayout->addWidget(label_inbound);

        label_speed = new QLabel(centralwidget);
        label_speed->setObjectName(QString::fromUtf8("label_speed"));

        horizontalLayout->addWidget(label_speed);


        verticalLayout_3->addLayout(horizontalLayout);

        MainWindow->setCentralWidget(centralwidget);
        menubar = new QMenuBar(MainWindow);
        menubar->setObjectName(QString::fromUtf8("menubar"));
        menubar->setGeometry(QRect(0, 0, 800, 32));
        menu_program = new QMenu(menubar);
        menu_program->setObjectName(QString::fromUtf8("menu_program"));
        menu_spmode = new QMenu(menu_program);
        menu_spmode->setObjectName(QString::fromUtf8("menu_spmode"));
        menu_program_preference = new QMenu(menu_program);
        menu_program_preference->setObjectName(QString::fromUtf8("menu_program_preference"));
        menuActive_Server = new QMenu(menu_program);
        menuActive_Server->setObjectName(QString::fromUtf8("menuActive_Server"));
        menuActive_Routing = new QMenu(menu_program);
        menuActive_Routing->setObjectName(QString::fromUtf8("menuActive_Routing"));
        menu_preferences = new QMenu(menubar);
        menu_preferences->setObjectName(QString::fromUtf8("menu_preferences"));
        menu_server = new QMenu(menubar);
        menu_server->setObjectName(QString::fromUtf8("menu_server"));
        menu_share_item = new QMenu(menu_server);
        menu_share_item->setObjectName(QString::fromUtf8("menu_share_item"));
        menuCurrent_Group = new QMenu(menu_server);
        menuCurrent_Group->setObjectName(QString::fromUtf8("menuCurrent_Group"));
        menuCurrent_Select = new QMenu(menu_server);
        menuCurrent_Select->setObjectName(QString::fromUtf8("menuCurrent_Select"));
        MainWindow->setMenuBar(menubar);

        menubar->addAction(menu_program->menuAction());
        menubar->addAction(menu_preferences->menuAction());
        menubar->addAction(menu_server->menuAction());
        menu_program->addAction(actionShow_window);
        menu_program->addAction(menu_add_from_clipboard2);
        menu_program->addAction(menu_scan_qr);
        menu_program->addSeparator();
        menu_program->addAction(actionStart_with_system);
        menu_program->addAction(actionRemember_last_proxy);
        menu_program->addAction(actionAllow_LAN);
        menu_program->addAction(menuActive_Server->menuAction());
        menu_program->addAction(menuActive_Routing->menuAction());
        menu_program->addAction(menu_spmode->menuAction());
        menu_program->addAction(menu_program_preference->menuAction());
        menu_program->addSeparator();
        menu_program->addAction(actionRestart_Proxy);
        menu_program->addAction(actionRestart_Program);
        menu_program->addAction(menu_exit);
        menu_spmode->addAction(menu_spmode_system_proxy);
        menu_spmode->addAction(menu_spmode_vpn);
        menu_spmode->addAction(menu_spmode_disabled);
        menu_program_preference->addAction(actionfake);
        menuActive_Server->addAction(actionfake_2);
        menuActive_Routing->addAction(actionfake_3);
        menu_preferences->addAction(menu_manage_groups);
        menu_preferences->addAction(menu_basic_settings);
        menu_preferences->addAction(menu_routing_settings);
        menu_preferences->addAction(menu_vpn_settings);
        menu_preferences->addAction(menu_hotkey_settings);
        menu_preferences->addAction(menu_open_config_folder);
        menu_server->addAction(menu_add_from_input);
        menu_server->addAction(menu_add_from_clipboard);
        menu_server->addSeparator();
        menu_server->addAction(menu_start);
        menu_server->addAction(menu_stop);
        menu_server->addSeparator();
        menu_server->addAction(menu_select_all);
        menu_server->addAction(menu_move);
        menu_server->addAction(menu_clone);
        menu_server->addAction(menu_reset_traffic);
        menu_server->addAction(menu_delete);
        menu_server->addSeparator();
        menu_server->addAction(menu_share_item->menuAction());
        menu_server->addSeparator();
        menu_server->addAction(menuCurrent_Select->menuAction());
        menu_server->addAction(menuCurrent_Group->menuAction());
        menu_server->addSeparator();
        menu_server->addAction(menu_profile_debug_info);
        menu_server->addSeparator();
        menu_share_item->addAction(menu_qr);
        menu_share_item->addAction(menu_export_config);
        menu_share_item->addSeparator();
        menu_share_item->addAction(menu_copy_links);
        menu_share_item->addAction(menu_copy_links_nkr);
        menuCurrent_Group->addAction(actionfake_5);
        menuCurrent_Group->addAction(menu_tcp_ping);
        menuCurrent_Group->addAction(menu_url_test);
        menuCurrent_Group->addAction(menu_full_test);
        menuCurrent_Group->addAction(menu_stop_testing);
        menuCurrent_Group->addAction(menu_clear_test_result);
        menuCurrent_Group->addAction(menu_resolve_domain);
        menuCurrent_Group->addSeparator();
        menuCurrent_Group->addAction(menu_remove_unavailable);
        menuCurrent_Group->addAction(menu_delete_repeat);
        menuCurrent_Group->addSeparator();
        menuCurrent_Group->addAction(menu_update_subscription);
        menuCurrent_Select->addAction(actionfake_4);

        retranslateUi(MainWindow);

        tabWidget->setCurrentIndex(0);
        down_tab->setCurrentIndex(0);


        QMetaObject::connectSlotsByName(MainWindow);
    } // setupUi

    void retranslateUi(QMainWindow *MainWindow)
    {
        menu_exit->setText(QCoreApplication::translate("MainWindow", "Exit", nullptr));
        actionShow_window->setText(QCoreApplication::translate("MainWindow", "Show Window", nullptr));
        menu_basic_settings->setText(QCoreApplication::translate("MainWindow", "Basic Settings", nullptr));
        menu_add_from_input->setText(QCoreApplication::translate("MainWindow", "New profile", nullptr));
        menu_manage_groups->setText(QCoreApplication::translate("MainWindow", "Groups", nullptr));
        menu_start->setText(QCoreApplication::translate("MainWindow", "Start", nullptr));
        menu_stop->setText(QCoreApplication::translate("MainWindow", "Stop", nullptr));
        menu_routing_settings->setText(QCoreApplication::translate("MainWindow", "Routing Settings", nullptr));
        menu_add_from_clipboard->setText(QCoreApplication::translate("MainWindow", "Add profile from clipboard", nullptr));
        menu_delete->setText(QCoreApplication::translate("MainWindow", "Delete", nullptr));
        menu_add_from_clipboard2->setText(QCoreApplication::translate("MainWindow", "Add profile from clipboard", nullptr));
        menu_profile_debug_info->setText(QCoreApplication::translate("MainWindow", "Debug Info", nullptr));
        menu_qr->setText(QCoreApplication::translate("MainWindow", "QR Code and link", nullptr));
        menu_copy_link->setText(QCoreApplication::translate("MainWindow", "Copy Link", nullptr));
        menu_clear_test_result->setText(QCoreApplication::translate("MainWindow", "Clear Test Result", nullptr));
        menu_export_config->setText(QCoreApplication::translate("MainWindow", "Export %1 config", nullptr));
        menu_reset_traffic->setText(QCoreApplication::translate("MainWindow", "Reset Traffic", nullptr));
        menu_scan_qr->setText(QCoreApplication::translate("MainWindow", "Scan QR Code", nullptr));
        menu_spmode_system_proxy->setText(QCoreApplication::translate("MainWindow", "Enable System Proxy", nullptr));
        menu_spmode_disabled->setText(QCoreApplication::translate("MainWindow", "Disable", nullptr));
        menu_delete_repeat->setText(QCoreApplication::translate("MainWindow", "Remove Duplicates", nullptr));
        actionfake->setText(QCoreApplication::translate("MainWindow", "fake", nullptr));
        menu_move->setText(QCoreApplication::translate("MainWindow", "Move", nullptr));
        actionStart_with_system->setText(QCoreApplication::translate("MainWindow", "Start with system", nullptr));
        actionRemember_last_proxy->setText(QCoreApplication::translate("MainWindow", "Remember last profile", nullptr));
        actionAllow_LAN->setText(QCoreApplication::translate("MainWindow", "Allow other devices to connect", nullptr));
        menu_remove_unavailable->setText(QCoreApplication::translate("MainWindow", "Remove Unavailable", nullptr));
        menu_full_test->setText(QCoreApplication::translate("MainWindow", "Full Test", nullptr));
        menu_hotkey_settings->setText(QCoreApplication::translate("MainWindow", "Hotkey Settings", nullptr));
        menu_select_all->setText(QCoreApplication::translate("MainWindow", "Select All", nullptr));
        menu_copy_links_nkr->setText(QCoreApplication::translate("MainWindow", "Copy links of selected (Neko Links)", nullptr));
        actionfake_2->setText(QCoreApplication::translate("MainWindow", "fake", nullptr));
        actionfake_3->setText(QCoreApplication::translate("MainWindow", "fake", nullptr));
        menu_copy_links->setText(QCoreApplication::translate("MainWindow", "Copy links of selected", nullptr));
        menu_spmode_vpn->setText(QCoreApplication::translate("MainWindow", "Enable Tun", nullptr));
        menu_clone->setText(QCoreApplication::translate("MainWindow", "Clone", nullptr));
        menu_update_subscription->setText(QCoreApplication::translate("MainWindow", "Update subscription", nullptr));
        menu_resolve_domain->setText(QCoreApplication::translate("MainWindow", "Resolve domain", nullptr));
        menu_vpn_settings->setText(QCoreApplication::translate("MainWindow", "Tun Settings", nullptr));
        actionRestart_Program->setText(QCoreApplication::translate("MainWindow", "Restart Program", nullptr));
        menu_open_config_folder->setText(QCoreApplication::translate("MainWindow", "Open Config Folder", nullptr));
        actionRestart_Proxy->setText(QCoreApplication::translate("MainWindow", "Restart Proxy", nullptr));
        menu_stop_testing->setText(QCoreApplication::translate("MainWindow", "Stop Testing", nullptr));
        toolButton_program->setText(QCoreApplication::translate("MainWindow", "Program", nullptr));
        toolButton_preferences->setText(QCoreApplication::translate("MainWindow", "Preferences", nullptr));
        toolButton_server->setText(QCoreApplication::translate("MainWindow", "Server", nullptr));
        toolButton_ads->setText(QCoreApplication::translate("MainWindow", "Ads", nullptr));
        toolButton_document->setText(QCoreApplication::translate("MainWindow", "Document", nullptr));
        toolButton_update->setText(QCoreApplication::translate("MainWindow", "Update", nullptr));
        checkBox_VPN->setText(QCoreApplication::translate("MainWindow", "Tun Mode", nullptr));
        checkBox_SystemProxy->setText(QCoreApplication::translate("MainWindow", "System Proxy", nullptr));
        toolButton_url_test->setText(QCoreApplication::translate("MainWindow", "URL Test", nullptr));
        QTableWidgetItem *___qtablewidgetitem = proxyListTable->horizontalHeaderItem(0);
        ___qtablewidgetitem->setText(QCoreApplication::translate("MainWindow", "Type", nullptr));
        QTableWidgetItem *___qtablewidgetitem1 = proxyListTable->horizontalHeaderItem(1);
        ___qtablewidgetitem1->setText(QCoreApplication::translate("MainWindow", "Address", nullptr));
        QTableWidgetItem *___qtablewidgetitem2 = proxyListTable->horizontalHeaderItem(2);
        ___qtablewidgetitem2->setText(QCoreApplication::translate("MainWindow", "Name", nullptr));
        QTableWidgetItem *___qtablewidgetitem3 = proxyListTable->horizontalHeaderItem(3);
        ___qtablewidgetitem3->setText(QCoreApplication::translate("MainWindow", "Test Result", nullptr));
        QTableWidgetItem *___qtablewidgetitem4 = proxyListTable->horizontalHeaderItem(4);
        ___qtablewidgetitem4->setText(QCoreApplication::translate("MainWindow", "Traffic", nullptr));
        tabWidget->setTabText(tabWidget->indexOf(widget1), QString());
        down_tab->setTabText(down_tab->indexOf(tab), QCoreApplication::translate("MainWindow", "Log", nullptr));
        QTableWidgetItem *___qtablewidgetitem5 = tableWidget_conn->horizontalHeaderItem(0);
        ___qtablewidgetitem5->setText(QCoreApplication::translate("MainWindow", "Status", nullptr));
        QTableWidgetItem *___qtablewidgetitem6 = tableWidget_conn->horizontalHeaderItem(1);
        ___qtablewidgetitem6->setText(QCoreApplication::translate("MainWindow", "Outbound", nullptr));
        QTableWidgetItem *___qtablewidgetitem7 = tableWidget_conn->horizontalHeaderItem(2);
        ___qtablewidgetitem7->setText(QCoreApplication::translate("MainWindow", "Destination", nullptr));
        down_tab->setTabText(down_tab->indexOf(tab_2), QCoreApplication::translate("MainWindow", "Connection", nullptr));
        label_running->setText(QString());
        label_inbound->setText(QString());
        label_speed->setText(QString());
        menu_program->setTitle(QCoreApplication::translate("MainWindow", "Program", nullptr));
        menu_spmode->setTitle(QCoreApplication::translate("MainWindow", "System Proxy", nullptr));
        menu_program_preference->setTitle(QCoreApplication::translate("MainWindow", "Preferences", nullptr));
        menuActive_Server->setTitle(QCoreApplication::translate("MainWindow", "Active Server", nullptr));
        menuActive_Routing->setTitle(QCoreApplication::translate("MainWindow", "Active Routing", nullptr));
        menu_preferences->setTitle(QCoreApplication::translate("MainWindow", "Preferences", nullptr));
        menu_server->setTitle(QCoreApplication::translate("MainWindow", "Server", nullptr));
        menu_share_item->setTitle(QCoreApplication::translate("MainWindow", "Share", nullptr));
        menuCurrent_Group->setTitle(QCoreApplication::translate("MainWindow", "Current Group", nullptr));
        menuCurrent_Select->setTitle(QCoreApplication::translate("MainWindow", "Current Select", nullptr));
        (void)MainWindow;
    } // retranslateUi

};

namespace Ui {
    class MainWindow: public Ui_MainWindow {};
} // namespace Ui

QT_END_NAMESPACE

#endif // UI_MAINWINDOW_H

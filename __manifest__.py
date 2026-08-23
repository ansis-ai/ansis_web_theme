{
    'name': 'ANSIS Web Theme', 
    'summary': 'Odoo Community Backend Theme',
    'description': '''
        This module offers a mobile compatible design for Odoo Community. 
        Furthermore it allows the user to define some design preferences.
    ''',
    'version': '18.0.1.2.5',
    'category': 'Themes/Backend', 
    'license': 'LGPL-3', 
    'author': 'ANSIS Pte Ltd',
    'website': 'https://ansis.com.sg',
    'depends': [
        'muk_web_chatter',
        'muk_web_dialog',
        'muk_web_appsbar',
        'muk_web_colors',
    ],
    'excludes': [
        'web_enterprise',
    ],
    'data': [
        'templates/web_layout.xml',
        'views/res_config_settings.xml',
    ],
    'assets': {
        'web._assets_primary_variables': [
            (
                'after', 
                'web/static/src/scss/primary_variables.scss', 
                'ansis_web_theme/static/src/scss/colors.scss'
            ),
            (
                'after', 
                'web/static/src/scss/primary_variables.scss', 
                'ansis_web_theme/static/src/scss/variables.scss'
            ),
        ],
        'web.assets_backend': [
            'ansis_web_theme/static/src/scss/**/*.scss',
            'ansis_web_theme/static/src/webclient/**/*.xml',
            'ansis_web_theme/static/src/webclient/**/*.scss',
            'ansis_web_theme/static/src/webclient/**/*.js',
            'ansis_web_theme/static/src/views/**/*.scss',
        ],
    },
    'images': [
        'static/description/banner.png',
        'static/description/theme_screenshot.png'
    ],
    'installable': True,
    'application': False,
    'auto_install': False,
    'post_init_hook': '_setup_module',
    'uninstall_hook': '_uninstall_cleanup',
}

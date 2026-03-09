import router from '@adonisjs/core/services/router'

router.on('/').renderInertia('Home')
router.on('/privacy').renderInertia('Privacy')
router.on('/terms').renderInertia('Terms')
router.on('/contact').renderInertia('Contact')

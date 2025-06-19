const config = {
    backend_url: String(import.meta.env.VITE_BACKEND_URL),
    emailjs_public_api_key: String(import.meta.env.VITE_EMAIL_JS_PUBLIC_API_KEY),
    emailjs_template_id: String(import.meta.env.VITE_EMAIL_JS_TEMPLATE_ID),
    emailjs_service_id: String(import.meta.env.VITE_EMAIL_JS_SERVICE_ID),

    firebase: {
        api_key: import.meta.env.VITE_API_KEY,
        auth_domain: import.meta.env.VITE_AUTH_DOMAIN,
        project_id: import.meta.env.VITE_PROJECT_ID,
        storage_bucket: import.meta.env.VITE_STORAGE_BUCKET,
        messaging_sender_id: import.meta.env.VITE_MESSAGING_SENDER_ID,
        app_id: import.meta.env.VITE_APP_ID,
    }
}  


export default config;

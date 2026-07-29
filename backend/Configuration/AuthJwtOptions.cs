namespace backend.Configuration
{
    public class AuthJwtOptions
    {
        public string Key { get; set; } = "";
        public string Issuer { get; set; } = "monitoramento-local";
        public string Audience { get; set; } = "authenticated";
    }
}

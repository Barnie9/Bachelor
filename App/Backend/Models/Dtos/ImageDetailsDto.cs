namespace Models;

public class ImageDetailsDto
{
    public string Username { get; set; }
    public DateTime Timestamp { get; set; }
    public List<float> ImagePixels { get; set; }
}
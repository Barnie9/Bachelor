using Tensorflow;
using static Tensorflow.Binding;
using NumSharp;

namespace Services;

public class Predictor
{
    private const string ModelPath =
        "D:\\GitHub Repositories\\Bachelor\\App\\Backend\\Services\\Utils\\alexnet_model.pb";
    private static readonly string[] Labels = { "Anger", "Disgust", "Fear", "Happiness", "Sadness", "Surprise", "Neutral" };

    public static string Predict(float[] imageArray)
    {
        /*
        tf.enable_eager_execution();

        var model = tf.keras.models.load_model("D:\\GitHub Repositories\\Bachelor\\App\\Backend\\Services\\Utils\\alexnet_model.tflite");

        var normalizedImageArray = imageArray.Select(x => x / 255.0f).ToArray();

        // Convert the array to a tensor and reshape it to match the input shape [1, 48, 48, 1]
        var tensor = np.array(normalizedImageArray).reshape(new Shape(1, 48, 48, 1));

        // Make prediction
        var predictions = model.predict(tensor);

        // Output the prediction
        Console.WriteLine(predictions.ToString());
        */

        var graph = new Graph().as_default();
        var graphDef = GraphDef.Parser.ParseFrom(File.ReadAllBytes(ModelPath));
        tf.import_graph_def(graphDef, name: "");

        var session = new Session(graph);

        var normalizedImageArray = imageArray.Select(x => x / 255.0f).ToArray();

        var npArray = np.array(normalizedImageArray).astype(np.float32).reshape(1, 48, 48, 1);

        var inputTensor = graph.OperationByName("x").output; // Placeholder tensor for input
        var outputTensor = graph.OperationByName("sequential_1/dense_2_1/Softmax").output;

        var feedDict = new FeedItem[]
        {
            new FeedItem(inputTensor, npArray),
        };

        var result = session.run(outputTensor, feedDict);

        var resultArray = result.ToArray<float>();

        var maxIndex = resultArray.ToList().IndexOf(resultArray.Max());

        return Labels[maxIndex];

        /*
        // Load the model
        var model = Model.LoadModel("D:\\GitHub Repositories\\Bachelor\\App\\Backend\\Services\\Utils\\alexnet_model.pb");

        // Ensure the image array has the correct number of elements
        if (imageArray.Length != 48 * 48)
        {
            Console.WriteLine($"Incorrect image size: expected 2304 elements, but got {imageArray.Length}");
            return;
        }

        // Convert to a NumSharp array and reshape it to match the model input
        var npArray = np.array(imageArray).astype(np.float32).reshape(1, 48, 48, 1);

        var numpyArray = npArray.ToArray<float>();

        // Make prediction
        var prediction = model.Predict(numpyArray);

        // Output the prediction
        Console.WriteLine(prediction);
        */
    }
}
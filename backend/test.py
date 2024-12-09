from transformers import BartForConditionalGeneration, BartTokenizer, GenerationConfig
import torch
from bs4 import BeautifulSoup


def inference(content):
    soup = BeautifulSoup(content, "html.parser")
    input_text = soup.get_text(strip=True)
    model = BartForConditionalGeneration.from_pretrained("./model")
    tokenizer = BartTokenizer.from_pretrained("./model")

    model.config.forced_bos_token_id = 0

    generation_config = GenerationConfig.from_pretrained("./model")

    inputs = tokenizer(
        input_text, return_tensors="pt", padding=True, truncation=True, max_length=712
    )

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model.to(device)
    inputs = {key: value.to(device) for key, value in inputs.items()}

    with torch.no_grad():
        output = model.generate(
            **inputs,
            max_length=300,
            num_beams=3,
            early_stopping=True,
            generation_config=generation_config
        )

    output_text = tokenizer.decode(output[0], skip_special_tokens=True)
    return output_text[len(input_text) + 1 :]

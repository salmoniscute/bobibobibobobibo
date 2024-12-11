import torch
from transformers import BertTokenizer, BertForSequenceClassification


def inference(content):

    label_rep = {
        "INFJ": 0,
        "ENTP": 1,
        "INTP": 2,
        "INTJ": 3,
        "ENTJ": 4,
        "ENFJ": 5,
        "INFP": 6,
        "ENFP": 7,
        "ISFP": 8,
        "ISTP": 9,
        "ISFJ": 10,
        "ISTJ": 11,
        "ESTP": 12,
        "ESFP": 13,
        "ESTJ": 14,
        "ESFJ": 15,
    }

    tokenizer = BertTokenizer.from_pretrained("bert-base-uncased", do_lower_case=True)

    model = BertForSequenceClassification.from_pretrained(
        "bert-base-uncased",
        num_labels=len(label_rep),
        output_attentions=False,
        output_hidden_states=False,
    )
    model.load_state_dict(
        torch.load(
            "finetuned_BERT_epoch_4.model",
            map_location=torch.device("cuda" if torch.cuda.is_available() else "cpu"),
        )
    )

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model.to(device)
    model.eval()

    # 將單一輸入字串進行編碼
    encoded_data = tokenizer.batch_encode_plus(
        [content],  # 將輸入字串包裝成列表
        add_special_tokens=True,
        return_attention_mask=True,
        pad_to_max_length=True,
        max_length=512,
        return_tensors="pt",
    )
    input_ids_test = encoded_data["input_ids"].to(device)
    attention_masks_test = encoded_data["attention_mask"].to(device)

    with torch.no_grad():
        outputs = model(input_ids_test, attention_mask=attention_masks_test)
        logits = outputs[0]

    predictions = torch.argmax(logits, dim=1).cpu().numpy()

    label_dict_inverse = {v: k for k, v in label_rep.items()}
    predicted_type = label_dict_inverse[predictions[0]]
    return predicted_type


# r = inference(
#     "What a day! I woke up early and went straight to the farmer’s market—everything was so colorful and alive! The fresh fruits, the bustling crowd, the aroma of coffee and baked goods in the air—it was like the world was alive with possibilities. I picked up some juicy peaches and a warm loaf of bread, and it felt like the perfect start to the day. Later, I went for a run in the park, feeling the cool breeze on my skin, hearing the crunch of leaves underfoot. There were so many people out, and the energy was contagious—kids running, dogs playing, and everyone just enjoying the sunshine. Afterward, I grabbed lunch with a friend at that new taco stand we’ve been hearing about. The flavors were amazing—spicy, tangy, and fresh, everything hitting my senses in the best way. It’s these little moments, the sights, the sounds, the tastes—that make life feel so alive. Can’t wait for tomorrow to do it all over again!"
# )
# print(r)

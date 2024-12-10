from tqdm.notebook import tqdm
import numpy as np
import pandas as pd
from tensorflow.keras.utils import pad_sequences
from keras import backend as K
import tensorflow as tf
from transformers import TFBertModel, BertTokenizer
from tensorflow.keras.layers import Input, Dense, Layer
from tensorflow.keras.models import Model


# 輸入
sentence = (
    "Time to debate on it. Strike at the weakest point and make others cry with facts"
)

bert_model_name = "bert-base-uncased"

tokenizer = BertTokenizer.from_pretrained(bert_model_name, do_lower_case=True)
MAX_LEN = 512


def tokenize_sentences(sentences, tokenizer, max_seq_len=512):
    tokenized_sentences = []

    for sentence in tqdm(sentences):
        tokenized_sentence = tokenizer.encode(
            sentence,  # Sentence to encode.
            add_special_tokens=True,  # Add '[CLS]' and '[SEP]'
            max_length=max_seq_len,  # Truncate all sentences.
        )

        tokenized_sentences.append(tokenized_sentence)

    return tokenized_sentences


def create_attention_masks(tokenized_and_padded_sentences):
    attention_masks = []

    for sentence in tokenized_and_padded_sentences:
        att_mask = [int(token_id > 0) for token_id in sentence]
        attention_masks.append(att_mask)

    return np.asarray(attention_masks)


# 配置
BERT_MODEL_NAME = "bert-large-uncased"

# 加载BERT预训练模型
bert_model = TFBertModel.from_pretrained(BERT_MODEL_NAME)


# 创建自定义层，用于封装 BERT 模型
class BertLayer(Layer):
    def __init__(self, bert_model, **kwargs):
        super(BertLayer, self).__init__(**kwargs)
        self.bert_model = bert_model

    def call(self, inputs):
        input_ids, attention_mask = inputs
        # 从BERT模型获取输出
        output = self.bert_model(input_ids=input_ids, attention_mask=attention_mask)

        # 从输出中提取 pooler_output，它是我们关心的输出张量
        return output.pooler_output  # 这是一个形状为 (None, 768) 的 tf.Tensor


# 定义模型输入
input_ids = Input(shape=(MAX_LEN,), dtype=tf.int32, name="input_ids")
attention_mask = Input(shape=(MAX_LEN,), dtype=tf.int32, name="attention_mask")

# 使用自定义BertLayer
bert_output = BertLayer(bert_model)([input_ids, attention_mask])

# 添加输出层
output = Dense(16, activation="sigmoid")(bert_output)

# 创建模型
model = Model(inputs=[input_ids, attention_mask], outputs=output)

# 输出模型架构
model.summary()
model.load_weights("my_model.weights.h5")
model.compile(
    optimizer=tf.keras.optimizers.Adam(learning_rate=0.00002),
    loss="categorical_crossentropy",
    metrics=["accuracy"],
)

cols = [
    "INFJ",
    "ENTP",
    "INTP",
    "INTJ",
    "ENTJ",
    "ENFJ",
    "INFP",
    "ENFP",
    "ISFP",
    "ISTP",
    "ISFJ",
    "ISTJ",
    "ESTP",
    "ESFP",
    "ESTJ",
    "ESFJ",
]
# cols = cols.tolist()

colnames = ["sentence"]
colnames = colnames + cols
df_predict = pd.DataFrame(columns=colnames)


df_predict.loc[0, "sentence"] = sentence

sentence_inputs = tokenize_sentences(df_predict["sentence"], tokenizer, MAX_LEN)
sentence_inputs = pad_sequences(
    sentence_inputs,
    maxlen=MAX_LEN,
    dtype="long",
    value=0,
    truncating="post",
    padding="post",
)
sentence_attention_masks = create_attention_masks(sentence_inputs)
prediction = model.predict(
    [np.array(sentence_inputs), np.array(sentence_attention_masks)]
)
df_predict.loc[0, cols] = prediction

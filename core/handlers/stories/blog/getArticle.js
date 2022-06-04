const logger = require('@/utils/logger');

module.exports = (req, res) => {
  res.json({
    success: true,
    data: [
      {
        id: '开发中1',
        title: '开发中1',
        desc: '王守仁（1472～1529），中国明代哲学家、教育家、军事家、文学家。字伯安，浙江余姚人。因筑室会稽阳明洞，自号阳明子，世称阳明先生。他28岁中进士后在京师任刑部云南清吏司主事、兵部武选清吏司主事，并主考山东乡试。后因弹劾宦官刘瑾，谪为贵州龙场驿丞。',
        thumbnail: '@resources/dynamic/images/blog/food.jpg',
      },
      {
        id: '开发中2',
        title: '开发中2',
        desc: '于谦（1398年5月13日－1457年2月16日），字廷益，号节庵，官至少保，世称于少保 ，汉族，浙江杭州府钱塘县（今浙江省杭州市上城区）人。明朝大臣、民族英雄、军事家、政治家。',
        thumbnail: '@resources/dynamic/images/blog/moon.jpg',
      },
      {
        id: '开发中3',
        title: '开发中3',
        desc: 'In traditional programming (what we’ve been doing prior to this point), programs are basically lists of instructions to the computer that define data (via objects) and then work with that data (via statements and functions). Data and the functions that work on that data are separate entities that are combined together to produce the desired result. Because of this separation, traditional programming often does not provide a very intuitive representation of reality. It’s up to the programmer to manage and connect the properties (variables) to the behaviors (functions) in an appropriate manner. ',
        thumbnail: '@resources/dynamic/images/blog/wood.jpg',
      },
      {
        id: '开发中4',
        title: '开发中4',
        desc: '岳飞从二十岁起，曾先后四次从军。自建炎二年（1128年）遇宗泽至绍兴十一年（1141年）止，先后参与、指挥大小战斗数百次。金军攻打江南时，独树一帜，力主抗金，收复建康。绍兴四年（1134年），收复襄阳六郡。绍兴六年（1136年），率师北伐，顺利攻取商州、虢州等地。绍兴十年（1140年），完颜宗弼毁盟攻宋，岳飞挥师北伐，两河人民奔走相告，各地义军纷纷响应，夹击金军。岳家军先后收复郑州、洛阳等地，在郾城、颍昌大败金军，进军朱仙镇。宋高宗赵构和宰相秦桧却一意求和，以十二道“金字牌”催令班师。在宋金议和过程中，岳飞遭受秦桧、张俊等人诬陷入狱。1142年1月，以莫须有的罪名，与长子岳云、部将张宪一同遇害。宋孝宗时，平反昭雪，改葬于西湖畔栖霞岭，追谥武穆，后又追谥忠武，封鄂王。',
        thumbnail: '@resources/dynamic/images/blog/wood.jpg',
      },
      {
        id: '开发中5',
        title: '开发中5',
        desc: 'In most cases, C++ will happily convert values of one fundamental type to another fundamental type. The process of converting a value from one type to another type is called type conversion. Thus, the int argument 5 will be converted to double value 5.0 and then copied into parameter x. ',
        thumbnail: '@resources/dynamic/images/blog/food.jpg',
      },
      {
        id: '开发中6',
        title: '开发中6',
        desc: `How these instructions are organized is beyond the scope of this introduction, but it is interesting to note two things. First, each instruction is composed of a sequence of 1s and 0s. Each individual 0 or 1 is called a binary digit, or bit for short. The number of bits that make up a single command vary -- for example, some CPUs process instructions that are always 32 bits long, whereas some other CPUs (such as the x86 family, which you are likely using) have instructions that can be a variable length. Second, each set of binary digits is interpreted by the CPU into a command to do a very specific job, such as compare these two numbers, or put this number in that memory location. However, because different CPUs have different instruction sets, instructions that were written for one CPU type could not be used on a CPU that didn’t share the same instruction set. This meant programs generally weren’t portable (usable without major rework) to different types of system, and had to be written all over again.`,
        thumbnail: '@resources/dynamic/images/blog/wood.jpg',
      },
    ],
  });
};

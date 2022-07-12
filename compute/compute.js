const compute = {
  //amount splitter
  split(Amount, SplitInfo) {
    const splitBreakdown = [];
    //keep Amount immutable but 'amount' variable
    //strongly resisted the evil temptation in making 'amount' a global var
    let amount = Amount;
    const sortedSplitInfo = this.sortSplitInfo(SplitInfo);
    const ratioTypes = [];
    let totalRatio = 0;
    for (let i = 0; i < sortedSplitInfo.length; i++) {
      if (
        sortedSplitInfo[i].SplitType === "FLAT" ||
        sortedSplitInfo[i].SplitType === "PERCENTAGE"
      ) {
        let result = this.flatOrPercent(sortedSplitInfo[i], amount);
        amount = result.newAmount;
        splitBreakdown.push(result.data);
      } else {
        totalRatio += sortedSplitInfo[i].SplitValue;
        ratioTypes.push(sortedSplitInfo[i]);
      }
    }
    //calculating ratio types
    const openingRatioBalance = amount;
    for (let i = 0; i < ratioTypes.length; i++) {
      let result = this.ratioCalc(
        ratioTypes[i],
        totalRatio,
        openingRatioBalance,
        amount
      );
      amount = result.newAmount;
      splitBreakdown.push(result.data);
    }
    return { amount, splitBreakdown };
  },
  sortSplitInfo(SplitInfo) {
    //no extra logic needed....sort SplitType based on the SplitType first alphabetical character
    return SplitInfo.sort((a, b) => {
      return a.SplitType[0] > b.SplitType[0]
        ? 1
        : a.SplitType[0] === b.SplitType[0]
        ? 0
        : -1;
    });
  },
  //FLAT & PERCENT type amount splitter
  flatOrPercent(SplitInfo, amount) {
    if (SplitInfo.SplitType === "FLAT") {
      const data = {
        SplitEntityId: SplitInfo.SplitEntityId,
        Amount: this.amountCleanup(SplitInfo.SplitValue),
      };
      //new const for ignore the amount---functional programming way
      const newAmount = amount - SplitInfo.SplitValue;
      return { newAmount, data };
    } else {
      const splitAmount = (SplitInfo.SplitValue / 100) * amount;
      const newAmount = amount - splitAmount;
      const data = {
        SplitEntityId: SplitInfo.SplitEntityId,
        Amount: this.amountCleanup(splitAmount),
      };
      return { newAmount, data };
    }
  },
  ratioCalc(ratioType, totalRatio, ratioAmount, amount) {
    const splitAmount = (ratioType.SplitValue / totalRatio) * ratioAmount;
    const newAmount = amount - splitAmount;
    const data = {
      SplitEntityId: ratioType.SplitEntityId,
      Amount: this.amountCleanup(splitAmount),
    };
    return { newAmount, data };
  },
  amountCleanup(amount) {
    return amount % 1 === 0 ? amount : Number(amount.toFixed(2));
  },
};

module.exports = compute;

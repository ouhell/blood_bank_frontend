import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationFirst,
  PaginationItem,
  PaginationLast,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

type Props = {
  totalPages: number;
  currentPageNumber: number;
  onClickFirstPage?: () => void;
  onClickLastPage?: () => void;
  onClickNext?: (nextPage: number) => void;
  onClickPrevious?: (prevPage: number) => void;
  onClickPage?: (pageNumber: number) => void;
};

type PageData = {
  number: number;
  showPagination: boolean;
};

const NumberedPagination = ({
  onClickFirstPage,
  onClickPrevious,
  onClickNext,
  onClickLastPage,
  currentPageNumber,
  totalPages,
  onClickPage,
}: Props) => {
  const isLastPage = currentPageNumber >= totalPages;
  const isFirstPage = currentPageNumber === 1;

  const currentPage: PageData = {
    number: currentPageNumber,
    showPagination: true,
  };

  const previousPage: PageData = {
    number: currentPage.number - 1,
    showPagination: currentPage.number > 1,
  };

  const beforePreviousPage: PageData = {
    number: previousPage.number - 1,
    showPagination: previousPage.number > 1,
  };

  const nextPage: PageData = {
    number: currentPage.number + 1,
    showPagination: totalPages > currentPage.number,
  };
  const afterNextPage: PageData = {
    number: nextPage.number + 1,
    showPagination: totalPages > nextPage.number,
  };

  const pages = [
    beforePreviousPage,
    previousPage,
    currentPage,
    nextPage,
    afterNextPage,
  ];

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationFirst
            className={cn({
              "cursor-default text-muted-foreground hover:bg-transparent hover:text-muted-foreground":
                isFirstPage,
            })}
            onClick={() => {
              if (isFirstPage) return;
              onClickFirstPage?.();
            }}
          />
        </PaginationItem>
        <PaginationItem>
          <PaginationPrevious
            className={cn({
              "cursor-default text-muted-foreground hover:bg-transparent hover:text-muted-foreground":
                isFirstPage,
            })}
            onClick={() => {
              if (isFirstPage) return;
              onClickPrevious?.(previousPage.number);
            }}
          />
        </PaginationItem>

        {pages.map((page, i) => {
          return (
            page.showPagination && (
              <PaginationItem key={page.number}>
                <PaginationLink
                  isActive={currentPage.number === page.number}
                  onClick={() => {
                    onClickPage?.(page.number);
                  }}
                >
                  {page.number}
                </PaginationLink>
              </PaginationItem>
            )
          );
        })}

        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>

        <PaginationItem>
          <PaginationNext
            className={cn({
              "cursor-default text-muted-foreground hover:bg-transparent hover:text-muted-foreground":
                isLastPage,
            })}
            onClick={() => {
              if (isLastPage) return;
              onClickNext?.(nextPage.number);
            }}
          />
        </PaginationItem>

        <PaginationItem>
          <PaginationLast
            className={cn({
              "cursor-default text-muted-foreground hover:bg-transparent hover:text-muted-foreground":
                isLastPage,
            })}
            onClick={() => {
              if (isLastPage) return;
              onClickLastPage?.();
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default NumberedPagination;
